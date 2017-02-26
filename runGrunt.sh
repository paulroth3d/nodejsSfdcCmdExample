#!/bin/bash

echo "Running 'grunt watch' and putting the output to Grunt.output"
echo "-- to see all jobs running, please run 'jobs'"
echo "-- to bring the job back, run 'fg 1'"
echo ""
grunt watch > Grunt.output 2>Grunt.output &

