#!/bin/bash

# Command to run in the first terminal
command1="dfsp"

# Command to run in the second terminal
command2="dfsb"

# Command to run in the third terminal
command3="dfsf"

# Open terminals and run commands
gnome-terminal -- bash -c "$command1; exec bash"
gnome-terminal -- bash -c "$command2; exec bash"
gnome-terminal -- bash -c "$command3; exec bash"
