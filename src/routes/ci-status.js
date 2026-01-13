const express = require('express');
const router = express.Router();
const { Octokit } = require('@octokit/rest');

// GET /api/ci-status
// Returns the latest workflow run and its jobs for the default branch (main)
router.get('/', async (req, res) => {
  const repoFull = process.env.GITHUB_REPOSITORY || process.env.REPO || 'Abdul-Hannan-21/Medical-Laboratory-System-CI-CD-Pipeline';
  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;

  const [owner, repo] = repoFull.split('/');

  if (!owner || !repo) {
    return res.status(500).json({ error: 'Repository not configured. Set GITHUB_REPOSITORY env var (owner/repo).' });
  }

  try {
    const octokit = token ? new Octokit({ auth: token }) : new Octokit();

    // Get latest workflow runs on main branch
    const runs = await octokit.actions.listWorkflowRunsForRepo({ owner, repo, branch: 'main', per_page: 1 });
    if (!runs.data || runs.data.total_count === 0) {
      return res.json({ message: 'No workflow runs found for branch main', jobs: [] });
    }

    const run = runs.data.workflow_runs[0];

    // Get jobs for the run
    const jobsResp = await octokit.actions.listJobsForWorkflowRun({ owner, repo, run_id: run.id });

    const jobs = (jobsResp.data && jobsResp.data.jobs) ? jobsResp.data.jobs.map(j => ({
      id: j.id,
      name: j.name,
      status: j.status,
      conclusion: j.conclusion,
      started_at: j.started_at,
      completed_at: j.completed_at
    })) : [];

    res.json({ run: { id: run.id, head_branch: run.head_branch, status: run.status, conclusion: run.conclusion, html_url: run.html_url }, jobs });
  } catch (err) {
    console.error('ci-status error', err && err.message ? err.message : err);
    return res.status(500).json({ error: err.message || String(err) });
  }
});

module.exports = router;
