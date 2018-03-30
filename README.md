mdn-linkchecker
===============

*mdn-linkchecker* is a CLI tool which uses HEAD requests to check link status
on MDN based on links from MDN's BCD data.

It will produce a log file containing a list of links producing 404.
This error log can for later runs function as a scope file to limit the
need to check all links in the BCD data-set.

This tool may only be useful if you intend to create MDN doc pages
which this tool can give you an overview over links that are missing
content.

**Be sure to check out the options (--help) to setup proper batching.**


Install
-------

**mdn-linkchecker** can be installed in various ways:

- Git using HTTPS: `git clone https://github.com/epistemex/mdn-linkchecker.git`
- Git using SSH: `git clone git@github.com:epistemex/mdn-linkchecker.git`
- Download [zip archive](https://github.com/epistemex/mdn-linkchecker/archive/master.zip) and extract.
- Via NPM: `npm i mdn-linkchecker` or `npm i -g mdn-linkchecker` if you prefer global access.


Usage
-----

At first run you will want to run with the option `--init` to produce the log file
which later will be used to limit the scope:

    $ mdn-linkchecker --init

or if you run it from a git clone/zip - cd to root folder of the repository, then:

    $ node index.js --init

You can limit range to check with various options, delays, batch size and so forth:

```text
-v, --version                output the version number
-i, --init                   Initialize. This will check every link in the BCD.
-b, --batch <requests>       Batch size. Number of requests per batch (def.: 10)
-s, --start <index>          Start from this index in link list (default: 0)
-l, --length <index>         Number of items from start to process. -1=all (def.: -1)
-e, --end <index>            End at this index (instead of using --length)
-d, --delay <milliseconds>   Delay in milliseconds between each fully processed batch (def.: 1200)
-w, --width <chars>          Total line width for progress bars (default: 72)
-y, --idelay <milliseconds>  Inter-delay in milliseconds between each request in a batch (def.: 10)
-h, --help                   output usage information
```

For example, running a batch with 1000 links starting at 1000h index, requesting 20 links per
batch with a 20ms delay between each and 1.5s between each batch:

    $ mdn-linkchecker --init --start 1000 --length 1000 --batch 20 --delay 1500 --idelay 20

or as short version:

    $ mdn-linkchecker -i -s 1000 -l 1000 -b 20 -d 1500 -y 20

When a initial list has been created (in the current folder) you can run it again from time to time
using the log file as input for links to recheck. This help avoid sending multiple request to the MDN server.

Using the default settings, simply run:

    $ mdn-linkchecker

This will update the log by removing links that are now found. Repeat the process until
all dead links are solved (ideally anyways).

I have included a log file current as of 3/2018. From time to time you will need to do a full
check though to catch new features (and their links) added to the BCD. Remember to occasionally
update the BCD dependency as well using npm update.


Requirements
------------

- Node 8+


Issues
------

See the [issue tracker](https://github.com/epistemex/mdn-linkchecker/issues) for details.


License
-------

Released under [MIT license](http://choosealicense.com/licenses/mit/).


*&copy; Epistemex 2018*

![Epistemex](https://i.imgur.com/GP6Q3v8.png)
