// Analytics Dashboard for To-Do List
// Major Contribution: Advanced Analytics and Insights

class AnalyticsDashboard {
  constructor() {
    this.initializeDashboard();
  }

  // Initialize the analytics dashboard
  initializeDashboard() {
    this.addDashboardButton();
    this.createDashboardModal();
  }

  // Add dashboard button to the interface
  addDashboardButton() {
    const buttonsWrapper = document.querySelector('.buttons-wrapper');
    if (buttonsWrapper) {
      const dashboardDiv = document.createElement('div');
      dashboardDiv.className = 'dashboard-button-container';
      dashboardDiv.innerHTML = `
        <button id="analyticsBtn" class="btn btn-primary btn-sm" title="View Analytics">
          <i class="fas fa-chart-bar"></i> Analytics
        </button>
      `;
      
      // Insert after data management buttons
      const dataManagementButtons = buttonsWrapper.querySelector('.data-management-buttons');
      if (dataManagementButtons) {
        dataManagementButtons.parentNode.insertBefore(dashboardDiv, dataManagementButtons.nextSibling);
      } else {
        buttonsWrapper.appendChild(dashboardDiv);
      }

      // Add event listener
      const analyticsBtn = document.getElementById('analyticsBtn');
      if (analyticsBtn) {
        analyticsBtn.addEventListener('click', () => this.showDashboard());
      }
    }
  }

  // Create dashboard modal
  createDashboardModal() {
    const modalHTML = `
      <div id="analyticsModal" class="analytics-modal">
        <div class="analytics-modal-content">
          <div class="analytics-modal-header">
            <h2><i class="fas fa-chart-line"></i> Task Analytics Dashboard</h2>
            <span class="analytics-close">&times;</span>
          </div>
          <div class="analytics-modal-body">
            <div class="analytics-grid">
              <div class="analytics-card">
                <h3>Overview</h3>
                <div id="overviewStats" class="stats-container"></div>
              </div>
              <div class="analytics-card">
                <h3>Productivity Trends</h3>
                <div id="productivityChart" class="chart-container"></div>
              </div>
              <div class="analytics-card">
                <h3>Category Breakdown</h3>
                <div id="categoryChart" class="chart-container"></div>
              </div>
              <div class="analytics-card">
                <h3>Priority Distribution</h3>
                <div id="priorityChart" class="chart-container"></div>
              </div>
              <div class="analytics-card">
                <h3>Completion Rate</h3>
                <div id="completionRate" class="progress-container"></div>
              </div>
              <div class="analytics-card">
                <h3>Recent Activity</h3>
                <div id="recentActivity" class="activity-container"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Add event listeners
    this.addModalEventListeners();
  }

  // Add modal event listeners
  addModalEventListeners() {
    const modal = document.getElementById('analyticsModal');
    const closeBtn = modal.querySelector('.analytics-close');
    
    closeBtn.addEventListener('click', () => this.hideDashboard());
    
    window.addEventListener('click', (event) => {
      if (event.target === modal) {
        this.hideDashboard();
      }
    });
  }

  // Show dashboard
  showDashboard() {
    const modal = document.getElementById('analyticsModal');
    modal.style.display = 'block';
    this.updateDashboard();
  }

  // Hide dashboard
  hideDashboard() {
    const modal = document.getElementById('analyticsModal');
    modal.style.display = 'none';
  }

  // Update dashboard with current data
  updateDashboard() {
    this.updateOverviewStats();
    this.updateProductivityChart();
    this.updateCategoryChart();
    this.updatePriorityChart();
    this.updateCompletionRate();
    this.updateRecentActivity();
  }

  // Update overview statistics
  updateOverviewStats() {
    const stats = this.getAnalyticsData();
    const container = document.getElementById('overviewStats');
    
    container.innerHTML = `
      <div class="stat-item">
        <div class="stat-value">${stats.totalTasks}</div>
        <div class="stat-label">Total Tasks</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">${stats.completedTasks}</div>
        <div class="stat-label">Completed</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">${stats.pendingTasks}</div>
        <div class="stat-label">Pending</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">${stats.completionRate}%</div>
        <div class="stat-label">Completion Rate</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">${stats.overdueTasks}</div>
        <div class="stat-label">Overdue</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">${stats.avgCompletionTime}</div>
        <div class="stat-label">Avg. Days to Complete</div>
      </div>
    `;
  }

  // Update productivity chart
  updateProductivityChart() {
    const container = document.getElementById('productivityChart');
    const weeklyData = this.getWeeklyProductivity();
    
    container.innerHTML = `
      <div class="productivity-bars">
        ${weeklyData.map(day => `
          <div class="productivity-bar">
            <div class="bar-label">${day.label}</div>
            <div class="bar-container">
              <div class="bar-fill" style="height: ${day.percentage}%"></div>
            </div>
            <div class="bar-value">${day.completed}</div>
          </div>
        `).join('')}
      </div>
    `;
  }

  // Update category chart
  updateCategoryChart() {
    const container = document.getElementById('categoryChart');
    const categoryData = this.getCategoryData();
    
    container.innerHTML = `
      <div class="category-list">
        ${Object.entries(categoryData).map(([category, count]) => `
          <div class="category-item">
            <div class="category-name">${category}</div>
            <div class="category-bar">
              <div class="category-fill" style="width: ${(count / Math.max(...Object.values(categoryData))) * 100}%"></div>
            </div>
            <div class="category-count">${count}</div>
          </div>
        `).join('')}
      </div>
    `;
  }

  // Update priority chart
  updatePriorityChart() {
    const container = document.getElementById('priorityChart');
    const priorityData = this.getPriorityData();
    
    container.innerHTML = `
      <div class="priority-list">
        ${Object.entries(priorityData).map(([priority, count]) => `
          <div class="priority-item priority-${priority}">
            <div class="priority-name">${priority}</div>
            <div class="priority-bar">
              <div class="priority-fill priority-${priority}" style="width: ${(count / Math.max(...Object.values(priorityData))) * 100}%"></div>
            </div>
            <div class="priority-count">${count}</div>
          </div>
        `).join('')}
      </div>
    `;
  }

  // Update completion rate
  updateCompletionRate() {
    const container = document.getElementById('completionRate');
    const stats = this.getAnalyticsData();
    
    container.innerHTML = `
      <div class="completion-progress">
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${stats.completionRate}%"></div>
        </div>
        <div class="progress-text">${stats.completionRate}% Complete</div>
      </div>
      <div class="completion-details">
        <div class="detail-item">
          <span class="detail-label">Completed:</span>
          <span class="detail-value">${stats.completedTasks}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Remaining:</span>
          <span class="detail-value">${stats.pendingTasks}</span>
        </div>
      </div>
    `;
  }

  // Update recent activity
  updateRecentActivity() {
    const container = document.getElementById('recentActivity');
    const recentTasks = this.getRecentActivity();
    
    container.innerHTML = `
      <div class="activity-list">
        ${recentTasks.map(task => `
          <div class="activity-item ${task.status}">
            <div class="activity-icon">
              <i class="fas ${task.status === 'completed' ? 'fa-check-circle' : 'fa-clock'}"></i>
            </div>
            <div class="activity-content">
              <div class="activity-text">${task.task}</div>
              <div class="activity-time">${task.time}</div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  // Get analytics data
  getAnalyticsData() {
    const todos = JSON.parse(localStorage.getItem("todos")) || [];
    
    const completedTasks = todos.filter(t => t.status === 'completed').length;
    const totalTasks = todos.length;
    const pendingTasks = totalTasks - completedTasks;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    
    // Calculate overdue tasks
    const overdueTasks = todos.filter(t => {
      if (!t.dueDate) return false;
      const today = new Date();
      const due = new Date(t.dueDate);
      return due < today && due.getDate() !== today.getDate();
    }).length;

    // Calculate average completion time
    const completedWithTime = todos.filter(t => t.status === 'completed' && t.completedTime && t.createTime);
    const avgCompletionTime = completedWithTime.length > 0 
      ? Math.round(completedWithTime.reduce((sum, t) => {
          const days = (t.completedTime - t.createTime) / (1000 * 60 * 60 * 24);
          return sum + days;
        }, 0) / completedWithTime.length)
      : 0;

    return {
      totalTasks,
      completedTasks,
      pendingTasks,
      completionRate,
      overdueTasks,
      avgCompletionTime
    };
  }

  // Get weekly productivity data
  getWeeklyProductivity() {
    const todos = JSON.parse(localStorage.getItem("todos")) || [];
    const completedTasks = todos.filter(t => t.status === 'completed');
    
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();
    const weekData = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dayLabel = days[date.getDay()];
      
      const dayCompleted = completedTasks.filter(task => {
        if (!task.completedTime) return false;
        const taskDate = new Date(task.completedTime);
        return taskDate.toDateString() === date.toDateString();
      }).length;
      
      const maxTasks = Math.max(1, Math.max(...weekData.map(d => d.completed), dayCompleted));
      const percentage = Math.round((dayCompleted / maxTasks) * 100);
      
      weekData.push({
        label: dayLabel,
        completed: dayCompleted,
        percentage
      });
    }
    
    return weekData;
  }

  // Get category data
  getCategoryData() {
    const todos = JSON.parse(localStorage.getItem("todos")) || [];
    const categoryCount = {};
    
    todos.forEach(task => {
      const category = task.category || 'personal';
      categoryCount[category] = (categoryCount[category] || 0) + 1;
    });
    
    return categoryCount;
  }

  // Get priority data
  getPriorityData() {
    const todos = JSON.parse(localStorage.getItem("todos")) || [];
    const priorityCount = {};
    
    todos.forEach(task => {
      const priority = task.priority || 'medium';
      priorityCount[priority] = (priorityCount[priority] || 0) + 1;
    });
    
    return priorityCount;
  }

  // Get recent activity
  getRecentActivity() {
    const todos = JSON.parse(localStorage.getItem("todos")) || [];
    const recentTasks = [];
    
    // Get recent completed tasks
    const completedTasks = todos
      .filter(t => t.status === 'completed' && t.completedTime)
      .sort((a, b) => b.completedTime - a.completedTime)
      .slice(0, 3);
    
    completedTasks.forEach(task => {
      const time = new Date(task.completedTime);
      recentTasks.push({
        task: task.task,
        status: 'completed',
        time: time.toLocaleDateString() + ' ' + time.toLocaleTimeString()
      });
    });
    
    // Get recent created tasks
    const createdTasks = todos
      .filter(t => t.createTime)
      .sort((a, b) => b.createTime - a.createTime)
      .slice(0, 3);
    
    createdTasks.forEach(task => {
      const time = new Date(task.createTime);
      recentTasks.push({
        task: task.task,
        status: 'created',
        time: time.toLocaleDateString() + ' ' + time.toLocaleTimeString()
      });
    });
    
    // Sort by time and take top 5
    return recentTasks
      .sort((a, b) => new Date(b.time) - new Date(a.time))
      .slice(0, 5);
  }
}

// Initialize analytics dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new AnalyticsDashboard();
}); 