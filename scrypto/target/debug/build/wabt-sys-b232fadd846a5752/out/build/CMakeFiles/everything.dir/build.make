# CMAKE generated file: DO NOT EDIT!
# Generated by "Unix Makefiles" Generator, CMake Version 3.24

# Delete rule output on recipe failure.
.DELETE_ON_ERROR:

#=============================================================================
# Special targets provided by cmake.

# Disable implicit rules so canonical targets will work.
.SUFFIXES:

# Disable VCS-based implicit rules.
% : %,v

# Disable VCS-based implicit rules.
% : RCS/%

# Disable VCS-based implicit rules.
% : RCS/%,v

# Disable VCS-based implicit rules.
% : SCCS/s.%

# Disable VCS-based implicit rules.
% : s.%

.SUFFIXES: .hpux_make_needs_suffix_list

# Command-line flag to silence nested $(MAKE).
$(VERBOSE)MAKESILENT = -s

#Suppress display of executed commands.
$(VERBOSE).SILENT:

# A target that is always out of date.
cmake_force:
.PHONY : cmake_force

#=============================================================================
# Set environment variables for the build.

# The shell in which to execute make rules.
SHELL = /bin/sh

# The CMake executable.
CMAKE_COMMAND = /opt/homebrew/Cellar/cmake/3.24.1/bin/cmake

# The command to remove a file.
RM = /opt/homebrew/Cellar/cmake/3.24.1/bin/cmake -E rm -f

# Escaping for special characters.
EQUALS = =

# The top-level source directory on which CMake was run.
CMAKE_SOURCE_DIR = /Users/jakemai/.cargo/registry/src/github.com-1ecc6299db9ec823/wabt-sys-0.8.0/wabt

# The top-level build directory on which CMake was run.
CMAKE_BINARY_DIR = /Users/jakemai/Documents/GitHub/rcnet-radiswap/scrypto/target/debug/build/wabt-sys-b232fadd846a5752/out/build

# Utility rule file for everything.

# Include any custom commands dependencies for this target.
include CMakeFiles/everything.dir/compiler_depend.make

# Include the progress variables for this target.
include CMakeFiles/everything.dir/progress.make

everything: CMakeFiles/everything.dir/build.make
.PHONY : everything

# Rule to build all files generated by this target.
CMakeFiles/everything.dir/build: everything
.PHONY : CMakeFiles/everything.dir/build

CMakeFiles/everything.dir/clean:
	$(CMAKE_COMMAND) -P CMakeFiles/everything.dir/cmake_clean.cmake
.PHONY : CMakeFiles/everything.dir/clean

CMakeFiles/everything.dir/depend:
	cd /Users/jakemai/Documents/GitHub/rcnet-radiswap/scrypto/target/debug/build/wabt-sys-b232fadd846a5752/out/build && $(CMAKE_COMMAND) -E cmake_depends "Unix Makefiles" /Users/jakemai/.cargo/registry/src/github.com-1ecc6299db9ec823/wabt-sys-0.8.0/wabt /Users/jakemai/.cargo/registry/src/github.com-1ecc6299db9ec823/wabt-sys-0.8.0/wabt /Users/jakemai/Documents/GitHub/rcnet-radiswap/scrypto/target/debug/build/wabt-sys-b232fadd846a5752/out/build /Users/jakemai/Documents/GitHub/rcnet-radiswap/scrypto/target/debug/build/wabt-sys-b232fadd846a5752/out/build /Users/jakemai/Documents/GitHub/rcnet-radiswap/scrypto/target/debug/build/wabt-sys-b232fadd846a5752/out/build/CMakeFiles/everything.dir/DependInfo.cmake --color=$(COLOR)
.PHONY : CMakeFiles/everything.dir/depend

