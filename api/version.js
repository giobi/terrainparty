// Vercel serverless function for version information
// This handles: /api/version

module.exports = async (req, res) => {
  try {
    // Get version from environment variable set during build or use git commit hash
    const version = process.env.VERCEL_GIT_COMMIT_SHA || process.env.GIT_COMMIT_HASH || 'dev';
    const shortVersion = version.substring(0, 7);
    
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'public, max-age=60'); // Cache for 1 minute
    
    res.json({
      version: shortVersion,
      fullVersion: version,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error getting version:', error);
    res.status(500).json({ error: 'Failed to get version' });
  }
};
