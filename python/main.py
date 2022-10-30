from PyQt6.QtWidgets import *
import sys

class MainWindow(QMainWindow):
  def __init__(self):
    super(MainWindow, self).__init__()
    self.setWindowTitle("Discord API Browser")

if __name__ == "__main__":
  app = QApplication(sys.argv)
  window = MainWindow()
  window.show()
  app.exec()