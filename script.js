/**
 * Fetch and render starred repositories from events.json
 */

async function loadStarredRepositories() {
  const container = document.getElementById('repositories-container');
  
  try {
    // Show loading state
    container.innerHTML = '<div class="loading">Loading repositories...</div>';
    
    // Fetch the events.json file
    const response = await fetch('./events.json');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    const repositories = data.starredRepositories;
    
    // Render the repositories
    if (repositories && repositories.length > 0) {
      renderRepositories(repositories);
    } else {
      container.innerHTML = '<div class="error">No starred repositories found.</div>';
    }
  } catch (error) {
    console.error('Error loading repositories:', error);
    container.innerHTML = `<div class="error">Error loading repositories: ${error.message}</div>`;
  }
}

/**
 * Render repositories as a list of cards
 * @param {Array} repositories - Array of repository objects
 */
function renderRepositories(repositories) {
  const container = document.getElementById('repositories-container');
  
  const html = repositories
    .map(repo => createRepoCard(repo))
    .join('');
  
  container.innerHTML = `<ul class="repositories-list">${html}</ul>`;
}

/**
 * Create an individual repository card HTML
 * @param {Object} repo - Repository object
 * @returns {string} HTML string for the repository card
 */
function createRepoCard(repo) {
  const formattedStars = formatNumber(repo.stars);
  
  return `
    <li class="repo-card">
      <div class="repo-header">
        <div>
          <h2 class="repo-title">
            <a href="${repo.url}" target="_blank" rel="noopener noreferrer">
              ${escapeHtml(repo.name)}
            </a>
          </h2>
        </div>
      </div>
      <div class="repo-meta">
        <span class="language-badge">${escapeHtml(repo.language)}</span>
        <div class="stars">
          <span class="star-icon">⭐</span>
          <span>${formattedStars}</span>
        </div>
        <div class="last-updated">Updated: ${repo.lastUpdated}</div>
      </div>
      <p class="repo-description">${escapeHtml(repo.description)}</p>
    </li>
  `;
}

/**
 * Format large numbers with commas
 * @param {number} num - Number to format
 * @returns {string} Formatted number string
 */
function formatNumber(num) {
  return num.toLocaleString('en-US');
}

/**
 * Escape HTML special characters to prevent XSS
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

// Load repositories when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', loadStarredRepositories);
