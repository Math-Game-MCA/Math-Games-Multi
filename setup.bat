
ROBOCOPY assets/vendor/* vendor /S
ROBOCOPY vendor/* assets/vendor /S
ROBOCOPY assets/vendor/* bower_components /S 
ROBOCOPY bower_components/* assets/vendor /S
ROBOCOPY bower_components/* vendor /S
 
echo "All synced up!"