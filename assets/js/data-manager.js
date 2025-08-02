// Data Management Module for To-Do List
// Major Contribution: Export/Import functionality

class DataManager {
  constructor() {
    this.initializeExportImport();
  }

  // Initialize export/import buttons
  initializeExportImport() {
    // Add export/import buttons to the UI
    this.addDataManagementButtons();
  }

  // Add export/import buttons to the interface
  addDataManagementButtons() {
    const buttonsWrapper = document.querySelector('.buttons-wrapper');
    if (buttonsWrapper) {
      const dataManagementDiv = document.createElement('div');
      dataManagementDiv.className = 'data-management-buttons';
      dataManagementDiv.innerHTML = `
        <button id="exportBtn" class="btn btn-success btn-sm" title="Export Tasks">
          <i class="fas fa-download"></i> Export
        </button>
        <button id="importBtn" class="btn btn-info btn-sm" title="Import Tasks">
          <i class="fas fa-upload"></i> Import
        </button>
        <input type="file" id="importFile" accept=".json" style="display: none;">
      `;
      
      // Insert after the search container
      const searchContainer = buttonsWrapper.querySelector('.search-container');
      if (searchContainer) {
        searchContainer.parentNode.insertBefore(dataManagementDiv, searchContainer.nextSibling);
      } else {
        buttonsWrapper.appendChild(dataManagementDiv);
      }

      // Add event listeners
      this.addEventListeners();
    }
  }

  // Add event listeners for export/import functionality
  addEventListeners() {
    const exportBtn = document.getElementById('exportBtn');
    const importBtn = document.getElementById('importBtn');
    const importFile = document.getElementById('importFile');

    if (exportBtn) {
      exportBtn.addEventListener('click', () => this.exportTasks());
    }

    if (importBtn) {
      importBtn.addEventListener('click', () => importFile.click());
    }

    if (importFile) {
      importFile.addEventListener('change', (e) => this.importTasks(e));
    }
  }

  // Export tasks to JSON file
  exportTasks() {
    try {
      const todos = JSON.parse(localStorage.getItem("todos")) || [];
      
      if (todos.length === 0) {
        this.showNotification('No tasks to export!', 'warning');
        return;
      }

      const exportData = {
        version: '1.0',
        exportDate: new Date().toISOString(),
        totalTasks: todos.length,
        tasks: todos
      };

      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `todo-tasks-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      this.showNotification(`Successfully exported ${todos.length} tasks!`, 'success');
    } catch (error) {
      console.error('Export error:', error);
      this.showNotification('Failed to export tasks!', 'error');
    }
  }

  // Import tasks from JSON file
  importTasks(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importData = JSON.parse(e.target.result);
        
        // Validate import data
        if (!this.validateImportData(importData)) {
          this.showNotification('Invalid import file format!', 'error');
          return;
        }

        // Confirm import
        this.confirmImport(importData);
      } catch (error) {
        console.error('Import error:', error);
        this.showNotification('Failed to read import file!', 'error');
      }
    };

    reader.readAsText(file);
    event.target.value = ''; // Reset file input
  }

  // Validate import data structure
  validateImportData(data) {
    return data && 
           typeof data === 'object' && 
           Array.isArray(data.tasks) && 
           data.tasks.length > 0;
  }

  // Confirm import with user
  confirmImport(importData) {
    const currentTodos = JSON.parse(localStorage.getItem("todos")) || [];
    const importCount = importData.tasks.length;
    const currentCount = currentTodos.length;
    
    const message = `Import ${importCount} tasks? This will ${currentCount > 0 ? 'merge with' : 'replace'} your current ${currentCount} tasks.`;
    
    if (confirm(message)) {
      this.performImport(importData);
    }
  }

  // Perform the actual import
  performImport(importData) {
    try {
      const currentTodos = JSON.parse(localStorage.getItem("todos")) || [];
      const importedTasks = importData.tasks;
      
      // Merge tasks, avoiding duplicates
      const mergedTasks = this.mergeTasks(currentTodos, importedTasks);
      
      localStorage.setItem("todos", JSON.stringify(mergedTasks));
      
      // Reload the page to show imported tasks
      location.reload();
      
      this.showNotification(`Successfully imported ${importedTasks.length} tasks!`, 'success');
    } catch (error) {
      console.error('Import error:', error);
      this.showNotification('Failed to import tasks!', 'error');
    }
  }

  // Merge tasks avoiding duplicates
  mergeTasks(currentTasks, importedTasks) {
    const merged = [...currentTasks];
    const existingTaskTexts = new Set(currentTasks.map(task => task.task.toLowerCase()));
    
    importedTasks.forEach(importedTask => {
      if (!existingTaskTexts.has(importedTask.task.toLowerCase())) {
        // Generate new ID for imported task
        importedTask.id = Math.round(Math.random() * 1000000);
        importedTask.createTime = new Date().getTime();
        merged.push(importedTask);
      }
    });
    
    return merged;
  }

  // Show notification to user
  showNotification(message, type = 'info') {
    // Use existing modal system if available
    if (typeof openmodal === 'function') {
      const colorMap = {
        'success': 'green',
        'error': 'red',
        'warning': 'blue',
        'info': 'blue'
      };
      openmodal(colorMap[type] || 'blue', message, 3000);
    } else {
      // Fallback to alert
      alert(message);
    }
  }

  // Get task statistics
  getTaskStatistics() {
    const todos = JSON.parse(localStorage.getItem("todos")) || [];
    
    const stats = {
      total: todos.length,
      completed: todos.filter(t => t.status === 'completed').length,
      incomplete: todos.filter(t => t.status === 'incomplete').length,
      overdue: todos.filter(t => t.dueDate && this.isOverdue(t.dueDate)).length,
      byCategory: {},
      byPriority: {}
    };

    // Count by category
    todos.forEach(task => {
      const category = task.category || 'personal';
      stats.byCategory[category] = (stats.byCategory[category] || 0) + 1;
    });

    // Count by priority
    todos.forEach(task => {
      const priority = task.priority || 'medium';
      stats.byPriority[priority] = (stats.byPriority[priority] || 0) + 1;
    });

    return stats;
  }

  // Check if task is overdue
  isOverdue(dueDate) {
    if (!dueDate) return false;
    const today = new Date();
    const due = new Date(dueDate);
    return due < today && due.getDate() !== today.getDate();
  }

  // Export statistics
  exportStatistics() {
    const stats = this.getTaskStatistics();
    const dataStr = JSON.stringify(stats, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `todo-statistics-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

// Initialize data manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new DataManager();
}); 