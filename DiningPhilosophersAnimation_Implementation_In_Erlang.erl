% Erlang Assessment 4 - DIning Philosopher Animation
% Kelechi Nnorom, Ken87, University of Kent
% NOTE: PLEASE RUN IN FULL SCREEN. THE ANIMATION IS DESIGNED WITH A LARGE SCALE 

-module(animation).
-compile([export_all]).

-include ("vtcons.hrl").
-define (Scale,10).

%******************* Helper Function ****************************************
draw_bar(X,Y,Z) when Y == Z -> vtcons ([{cursor_xy, X, Y}, {string, "|"}]);
				
draw_bar(X,Y,Z) when Y < Z -> vtcons ([{cursor_xy, X, Y}, {string, "|"}]),
				draw_bar(X, Y+1, Z).
				
draw_buttom_bar(X,EndX,Y) when X == EndX -> vtcons ([{cursor_xy, X, Y}, {string, "_"}]);
				
draw_buttom_bar(X,EndX,Y) when X < EndX -> vtcons ([{cursor_xy, X, Y}, {string, "_"}]),
				draw_buttom_bar(X+1, EndX, Y).

draw_fork(X,Y) -> vtcons ([{cursor_xy, X+1, Y}, {string, "|"}, {cursor_xy, X, Y+1}, {string,"\/|\\"}]).

erase_fork(X,Y) -> vtcons ([{cursor_xy, X+1, Y}, {erase_eol} , {cursor_xy, X, Y+1}, {erase_eol} , {cursor_xy, X, Y+2}, {erase_eol}]).

draw_philosopher(X,Y) -> vtcons ([{cursor_xy, X+1, Y}, {string, "()"}, {cursor_xy, X+1, Y+1}, 
						 {string, "-|-"}, {cursor_xy, X+1, Y+2}, {string,"\/|\\"}]).
						 						 
%****************************************************************************		
	


	
setup_canvas () ->
%Clear screen
	vtcons ({erase_screen}),  vtcons ({cursor_xy, 1, 1}), 
	
%Draw Dining Table (5-Shaped Polygon)								
	vtcons ([{cursor_xy, 70, 11}, {string, "Philosopher1"}, {cursor_xy, 114, 18}, {string, "Philosopher2"}, {cursor_xy, 40, 18}, {string, "Philosopher5"}, 
	{cursor_xy, 114, 37}, {string, "Philosopher3"}, {cursor_xy, 40, 37}, {string, "Philosopher4"}]),draw_bar(114, 19, 35), draw_bar(50, 19, 35), draw_buttom_bar(51, 113, 36), 
	
%Draw philosophers 
	draw_philosopher(73, 8), draw_philosopher(117, 15), draw_philosopher(43, 15), draw_philosopher(117, 34), draw_philosopher(43, 34),	
	
%Draw Food Plate (Square)
	draw_bar(70, 20, 25), draw_bar(90, 20, 25), draw_buttom_bar(70, 90, 20), draw_buttom_bar(70, 90, 25), 
	vtcons ([{ansi,?ANSI_ATTR_BOLD,?ANSI_FG_RED}, {cursor_xy, 74, 23}, {string, "EBA AND SOUP"}]).
	
	
display() ->
% Display is updated based on STATUS messages received
	receive 
		{"Thinking", "Philosopher1"} -> 
			vtcons ([{cursor_invisible}, {cursor_xy, 85, 11}, {erase_eol}, {string, "[Thinking]"}]);       
	
		{"Hungry", "Philosopher1"} -> 
			vtcons ([{cursor_invisible}, {cursor_xy, 85, 11}, {erase_eol}, {string, "[Hungry]"}]);      
			
		{"Eating", "Philosopher1"} -> 
			vtcons ([{cursor_invisible}, {cursor_xy, 85, 11}, {erase_eol}, {string, "[Eating]"}]);        
			
		
		{"Thinking", "Philosopher2"} -> 
			vtcons ([{cursor_invisible}, {cursor_xy, 130, 18}, {erase_eol}, {string, "[Thinking]"}]);       
	
		{"Hungry", "Philosopher2"} -> 
			vtcons ([{cursor_invisible}, {cursor_xy, 130, 18}, {erase_eol}, {string, "[Hungry]"}]);       
			
		{"Eating", "Philosopher2"} -> 
			vtcons ([{cursor_invisible}, {cursor_xy, 130, 18}, {erase_eol}, {string, "[Eating]"}]);  

			
		{"Thinking", "Philosopher3"} -> 
			vtcons ([{cursor_invisible}, {cursor_xy, 130, 37}, {erase_eol}, {string, "[Thinking]"}]);       
	
		{"Hungry", "Philosopher3"} -> 
			vtcons ([{cursor_invisible}, {cursor_xy, 130, 37}, {erase_eol}, {string, "[Hungry]"}]);       
			
		{"Eating", "Philosopher3"} -> 
			vtcons ([{cursor_invisible}, {cursor_xy, 130, 37}, {erase_eol}, {string, "[Eating]"}]); 
			
			
		{"Thinking", "Philosopher4"} -> 
			vtcons ([{cursor_invisible}, {cursor_xy, 40, 38}, {erase_eol}, {string, "[Thinking]"}]);       
	
		{"Hungry", "Philosopher4"} -> 
			vtcons ([{cursor_invisible}, {cursor_xy, 40, 38}, {erase_eol}, {string, "[Hungry]"}]);       
			
		{"Eating", "Philosopher4"} -> 
			vtcons ([{cursor_invisible}, {cursor_xy, 40, 38}, {erase_eol}, {string, "[Eating]"}]); 
			
			
		{"Thinking", "Philosopher5"} -> 
			vtcons ([{cursor_invisible}, {cursor_xy, 40, 19}, {erase_eol}, {string, "[Thinking]"}]);       
	
		{"Hungry", "Philosopher5"} -> 
			vtcons ([{cursor_invisible}, {cursor_xy, 40, 19}, {erase_eol}, {string, "[Hungry]"}]);       
			
		{"Eating", "Philosopher5"} -> 
			vtcons ([{cursor_invisible}, {cursor_xy, 40, 19}, {erase_eol}, {string, "[Eating]"}]);
			
			
		{"In Use", "Fork1", "Philosopher1"} ->   
			erase_fork(98,12), vtcons ([{cursor_xy, 79, 10}, {string, "Fork1"}]), draw_fork(79,8); 
		
		{"On Table", "Fork1"} -> 
			erase_fork(79,8), erase_fork(123,15), vtcons ([{cursor_xy, 98, 14}, {string, "Fork1"}]), draw_fork(98,12);  
			
		{"In Use", "Fork1", "Philosopher2"} -> 
			erase_fork(98,12), vtcons ([{cursor_xy, 123, 17}, {string, "Fork1"}]), draw_fork(123,15);
	
		
		{"In Use", "Fork2", "Philosopher2"} ->   
			erase_fork(108,25), vtcons ([{cursor_xy, 129, 17}, {string, "Fork2"}]), draw_fork(129,15); 
		
		{"On Table", "Fork2"} -> 
			erase_fork(129,15), erase_fork(123,34), vtcons ([{cursor_xy, 108, 27}, {string, "Fork2"}]), draw_fork(108,25);
			
		{"In Use", "Fork2", "Philosopher3"} -> 
			erase_fork(108,25), vtcons ([{cursor_xy, 123, 36}, {string, "Fork2"}]), draw_fork(123,34);
			
			
		{"In Use", "Fork3", "Philosopher3"} ->   
			erase_fork(79,39), vtcons ([{cursor_xy, 130, 36}, {string, "Fork3"}]), draw_fork(130,34); 
		
		{"On Table", "Fork3"} -> 
			erase_fork(130,34), erase_fork(43,39), vtcons ([{cursor_xy, 79, 41}, {string, "Fork3"}]), draw_fork(79,39);
			
		{"In Use", "Fork3", "Philosopher4"} ->   
			erase_fork(79,39), vtcons ([{cursor_xy, 43, 41}, {string, "Fork3"}]), draw_fork(43,39); 
			
			
		{"In Use", "Fork4", "Philosopher4"} ->   
			vtcons ([{cursor_xy, 50, 31}, {string, "In Use: Phil4"}]); 
		
		{"On Table", "Fork4"} -> 
			vtcons ([{cursor_xy, 50, 30}, {string, "Fork4"}]), draw_fork(50,28);
			
		{"In Use", "Fork4", "Philosopher5"} -> 
			vtcons ([{cursor_xy, 50, 31}, {string, "In Use: Phil5"}]);
			
		
		{"In Use", "Fork5", "Philosopher5"} ->   
			vtcons ([{cursor_xy, 55, 15}, {string, "In Use: Phil5"}]); 
		
		{"On Table", "Fork5"} -> 
			vtcons ([{cursor_xy, 55, 14}, {string, "Fork5"}]), draw_fork(55,12);
			
		{"In Use", "Fork5", "Philosopher1"} -> 
			vtcons ([{cursor_xy, 55, 15}, {string, "In Use: Phil1"}])
			
	end,	
	display().
	
	
fork (Disp, ForkName) ->

% All forks start off on the table  and wait for pick-up messages
	Disp ! {"OnTable", ForkName},
	receive
		{pickup, Pid, PhilName} -> 
		Pid ! {ack, self()},
		Disp ! {"In Use", ForkName, PhilName},
		
		receive
			{putdown} -> 
			Disp ! {"On Table", ForkName},
			fork(Disp, ForkName)
		end
	end.

	
	
philosopher (Disp, Lfork, Rfork, PhilName) ->

% All Philosophers starts off in a "thinking" state
	Disp ! {"Thinking", PhilName},
	random:seed(now()),
	Val = random:uniform(100),
	Dly = Val * ?Scale,
	timer:sleep(Dly),
	
% In the "Hungry" state we first check if the left Fork is free for use
% If it is we wait for the right fork and enter the "Eating" state

	Disp ! {"Hungry", PhilName},
	Lfork ! {pickup, self(), PhilName},
	receive {ack, Lfork} -> 
		Rfork ! {pickup, self(), PhilName},
		receive {ack, Rfork}  -> 
			Disp ! {"Eating", PhilName},
			Val2 = random:uniform(100),
			Dly2 = Val2 * ?Scale,
			timer:sleep(Dly2),
			Lfork ! {putdown},
			Rfork ! {putdown},
			philosopher(Disp, Lfork, Rfork, PhilName)
		end
	end.
		

		
college () ->
	
	setup_canvas(),
	
	% spawn 'display' process
	D = spawn_link (?MODULE, display, []),
	
	% create the 5 forks
	Fork1 = spawn_link (?MODULE, fork, [D, "Fork1"]),
	Fork2 = spawn_link (?MODULE, fork, [D, "Fork2"]),
	Fork3 = spawn_link (?MODULE, fork, [D, "Fork3"]),
	Fork4 = spawn_link (?MODULE, fork, [D, "Fork4"]),
	Fork5 = spawn_link (?MODULE, fork, [D, "Fork5"]),
	
	% create the 5 philosophers (plugged into the correct forks)
	spawn_link (?MODULE, philosopher, [D, Fork1, Fork5, "Philosopher1"]),
	spawn_link (?MODULE, philosopher, [D, Fork2, Fork1, "Philosopher2"]),
	spawn_link (?MODULE, philosopher, [D, Fork3, Fork2, "Philosopher3"]),
	spawn_link (?MODULE, philosopher, [D, Fork4, Fork3, "Philosopher4"]),
	spawn_link (?MODULE, philosopher, [D, Fork5, Fork4, "Philosopher5"]),
	
	% wait for something impossible (avoid termination).
	receive impossible -> true end.