Packages are stored in `.json` files in the `packages` folder. They are identified by the keys in the dictionaries.

`type`: This is the type of executable. This can be either `vmsh` or `js`

`exec`: If the executable is JavaScript, then it is the plain contents of a function enclosed in a string. If it is VMShell, then it is the line of vmsh in the string. Both types have access to the `args` variable containing all of the arguments passed to the command from the command line.

`desc`: The description of  the command

`ver`: The command version

See the commands inside of the packages folder for examples.