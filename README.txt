Our project is worth 100 points because we went through the effort of making our game as similar as we could get to the original Flappy Bird.
This involved a lot of research into features such as tilting and moving the bird which taught us a lot about the canvas element.
Although the project was somewhat time-consuming, we ended up making a product we are all proud of.


One of the hardest aspects of our project was implementing the bird's tilting animation when the player stopped pressing the spacebar.
Initially, we tried researching JavaScript libraries that could assist us with this task, but after several failed attempts, we ended
up utilizing basic canvas methods and tilting the bird based on its velocity. We messed with the constants repeatedly until we found
values we thought matched the original. This task took us the most time for this project, but we are very happy with the bird’s movement
in free-fall.


Our biggest research stemmed from implementing gravity on the bird and moving it up when the user presses space. We ended up utilizing
the Image() functionality from HTMLImageElement, and got very familiar with this element given basic syntax assistance. We were very surprised
as to how much functionality for the bird could be implemented using basic variables and methods of the image element.


Another difficult part of our code was the collision detection features. After several failed attempts, we ended up storing the pipes in an array
so that we could loop over their coordinates and check if the bird was ever hitting them. This works very well and allowed us to easily implement some edge cases we saw in the original game such as losing the game when the user hits a part of the pipe that is not visible.


Ultimately, we learned that there is a lot of built-in functionality with canvas elements we were previously unaware of. We also discovered how
helpful pair programming can be even with tasks as simple as drawing the background. The navigator would constantly find syntax issues with the
driver’s code which ultimately saved our group a lot of time when we were coding. 
