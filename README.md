# Infinite Maze Runner

Can you escape from this infinite maze ? Sure, you can't, but try to run as far as possible, farest than the other players.

## Game rules

You (represented by the Yellow Face 😀) start in the center of the maze. You have 60 seconds to run as far as you can from the center, or you will be blown by the explosion.

You can catch some power up to help your escape :
- 👻 The Ghost Mode : when you cath it, you can walk thru the wall in any direction for 20 steps. But watch out, you can be surrounded by walls if you leave Ghost Mode in a bad area.
- 🔍 The Zoom Mode : when you catch it, you view a wider area of the Maze. If you catch it once again, you go back to the normal view.

You can see other players competiting with you, they are represented by 😈 . You can not interact with them, they will not block you and you will not block them. You just have to run farest than the other players.

## Frontend

The [index.html](index.html) is the main game. Run it inside your browser.

## Backend

Two PHP scripts handle server side game :

- [init.php](init.php) : called by the frontend when loaded, it generate a (pseudo) seed to initialize the maze, and assign a player name.
- [me.php](me.php) : called by the fronted every 10s, it receive the player position and return other players position.

Create an empty "data" folder, and give RW access to this folder to the PHP scripts.

## The Maze

The Maze is infinite. It is pseudo-randomized generated. A new maze is generated every minute. Other players starting the same minute has you run in the same maze.