import sys
import json
from PyQt5.QtWidgets import QApplication, QMainWindow, QWidget, QVBoxLayout, QPushButton, QLineEdit, QDateEdit, QLabel, QHBoxLayout
from PyQt5.QtCore import QDate

class TaskWidget(QWidget):
    def __init__(self, date, task_text, completed=False, toggle_completion_callback=None, delete_task_callback=None):
        super().__init__()
        self.date = date
        self.task_text = task_text
        self.completed = completed
        self.toggle_completion_callback = toggle_completion_callback
        self.delete_task_callback = delete_task_callback

        self.layout = QHBoxLayout()
        self.label = QLabel(f"{self.task_text}")
        self.update_style()

        self.delete_button = QPushButton("X")
        self.delete_button.setStyleSheet("background-color: #FF6347; color: #FFFFFF; font-weight: bold; max-width: 20px; border-radius: 10px;")
        self.delete_button.clicked.connect(self.delete_task)

        self.layout.addWidget(self.label)
        self.layout.addWidget(self.delete_button)
        self.setLayout(self.layout)

        self.label.mousePressEvent = self.toggle_completion

    def toggle_completion(self, event):
        self.completed = not self.completed
        self.update_style()
        if self.toggle_completion_callback:
            self.toggle_completion_callback(self.date, self.task_text, self.completed)

    def delete_task(self):
        if self.delete_task_callback:
            self.delete_task_callback(self.date, self.task_text)

    def update_style(self):
        base_style = "padding: 5px; border-radius: 5px; font-weight: bold;"
        if self.completed:
            self.label.setStyleSheet(base_style + "text-decoration: line-through; color: #ffffff; background-color: #0A3D62;")
        else:
            self.label.setStyleSheet(base_style + "color: #0A3D62; background-color: #A7C7E7;")

class MainWindow(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("Security+ Study Plan Tracker")
        self.tasks_file = "tasks.json"
        self.setGeometry(100, 100, 800, 600)
        self.setStyleSheet("background-color: #EAF6FF; color: #072F5F; font-size: 14px;")

        self.tasks = self.load_tasks()
        self.central_widget = QWidget()
        self.setCentralWidget(self.central_widget)
        self.layout = QVBoxLayout()

        self.settings_button = QPushButton("Settings")
        self.settings_button.setStyleSheet("background-color: #1E4174; color: #FFFFFF; padding: 10px; border-radius: 10px;")
        self.settings_button.clicked.connect(self.toggle_settings)
        self.layout.addWidget(self.settings_button)

        self.settings_area = QWidget()
        self.settings_layout = QVBoxLayout()
        self.date_picker = QDateEdit()
        self.date_picker.setDate(QDate.currentDate())
        self.date_picker.setCalendarPopup(True)
        self.date_picker.setStyleSheet("background-color: #FFFFFF; color: #072F5F;")
        self.task_input = QLineEdit()
        self.task_input.setStyleSheet("background-color: #FFFFFF; color: #072F5F;")
        self.task_input.setPlaceholderText("Add new task")
        self.add_task_button = QPushButton("Add Task")
        self.add_task_button.setStyleSheet("background-color: #1E4174; color: #FFFFFF; padding: 10px; border-radius: 10px;")
        self.add_task_button.clicked.connect(self.add_task)
        self.settings_layout.addWidget(self.date_picker)
        self.settings_layout.addWidget(self.task_input)
        self.settings_layout.addWidget(self.add_task_button)
        self.settings_area.setLayout(self.settings_layout)
        self.layout.addWidget(self.settings_area)
        self.settings_area.hide()

        self.tasks_container = QWidget()
        self.tasks_layout = QVBoxLayout()
        self.tasks_container.setLayout(self.tasks_layout)
        self.layout.addWidget(self.tasks_container)

        self.central_widget.setLayout(self.layout)
        self.render_tasks()

    def toggle_settings(self):
        self.settings_area.setVisible(not self.settings_area.isVisible())

    def add_task(self):
        date = self.date_picker.date().toString("yyyy-MM-dd")
        task_text = self.task_input.text()
        if date and task_text:
            if date not in self.tasks:
                self.tasks[date] = []
            self.tasks[date].append({"task": task_text, "completed": False})
            self.task_input.clear()
            self.save_tasks()
            self.render_tasks()

    def toggle_task_completion(self, date, task_text, completed):
        for task in self.tasks[date]:
            if task["task"] == task_text:
                task["completed"] = completed
                break
        self.save_tasks()
        self.render_tasks()

    def delete_task(self, date, task_text):
        self.tasks[date] = [task for task in self.tasks[date]
                if task['task'] != task_text]
        if not self.tasks[date]:  # If no tasks are left for the date, remove the date key
            del self.tasks[date]
        self.save_tasks()
        self.render_tasks()

    def render_tasks(self):
        for i in reversed(range(self.tasks_layout.count())): 
            self.tasks_layout.itemAt(i).widget().setParent(None)

        for date, tasks in self.tasks.items():
            for task in tasks:
                task_widget = TaskWidget(date, task['task'], task['completed'], self.toggle_task_completion, self.delete_task)
                self.tasks_layout.addWidget(task_widget)

    def load_tasks(self):
        try:
            with open(self.tasks_file, "r") as file:
                tasks = json.load(file)
        except (FileNotFoundError, json.JSONDecodeError):
            tasks = {}
        return tasks

    def save_tasks(self):
        with open(self.tasks_file, "w") as file:
            json.dump(self.tasks, file, indent=4)

if __name__ == "__main__":
    app = QApplication(sys.argv)
    window = MainWindow()
    window.show()
    sys.exit(app.exec_())
