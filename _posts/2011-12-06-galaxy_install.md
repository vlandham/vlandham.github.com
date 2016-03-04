---
layout: post
title: Galaxy Server Install and Setup
categories:
- bioinfo
---

### Installing Galaxy on Scientific Linux 6

[Galaxy](http://main.g2.bx.psu.edu/) is a platform for managing, running, and sharing computational biology data and pipelines. Its a big idea, and a good idea, but a bit of a task to get working exactly how you might want it.

What follows is a brain dump of the initial setup and configuration of this tool. Sorry about the length.

Goals for sever configuration
-----------------------------

-   Follow all recommended settings for production level Galaxy server
-   Use Nginx proxy front-end
    -   Enable as much of proxy components as possible
-   Use local postgreSQL server
-   Try to make these instructions as complete as possible

Future goals for follow up configuration include

-   Enable and configure as many of the tools as possible
-   Provide easy access to local directories of sequencing data inside Galaxy
-   Experiment with with Galaxy Toolshed
-   Experiment with cluster configurations

About the System
----------------

Scientific Linux release 6.1 (Carbon)

Will use separate `galaxy` user to run galaxy

Galaxy user’s home directory will be located:
`/usr/local/galaxy`

Resources
---------

Most information comes from [apapow.net](http://www.agapow.net/science/bioinformatics/galaxy/installing-galaxy)

And [the galaxy wikis Production Server page](http://wiki.g2.bx.psu.edu/Admin/Config/Performance/Production%20Server)

Check base install
------------------

### Ensure python is installed and at 2.6

{% highlight bash %}
which python
# /usr/bin/python
python --version
# Python 2.6.6
{% endhighlight %}

### Ensure PostgreSQL is installed

{% highlight bash %}
sudo yum install postgresql postgresql-server
{% endhighlight %}

Modify PostgreSQL config file
-----------------------------

Tricky part to getting postgreSQL working is the `pg_hba.conf` file. Edit it to allow local connections.

{% highlight bash %}
sudo vim /var/lib/pgsql/data/pg_hba.conf
{% endhighlight %}

[A blog post explaining the syntax of this file](http://www.depesz.com/index.php/2007/10/04/ident/) . It should look something like:

{% highlight bash %}
local   all         all                               trust
host    all         all         127.0.0.1/32          trust
host    all         all         ::1/128               trust
host    all         all         0.0.0.0/0             md5
{% endhighlight %}

Startup PostgreSQL
------------------

{% highlight bash %}
sudo service postgresql initdb
sudo chkconfig postgresql on
sudo service postgresql start
{% endhighlight %}

Add galaxy user
---------------

**Note**

The `galaxy` user created here is not capable of using sudo. Every time sudo is used in this document, it is done from a sudo capable user.

Galaxy user’s home directory is at:
`/usr/local/galaxy`

This was done because `/home` is a remotely mounted disk.

{% highlight bash %}
sudo /usr/sbin/useradd galaxy --home /usr/local/galaxy
passwd galaxy
{% endhighlight %}

Install dependency packages
---------------------------

{% highlight bash %}
# install git just to have
sudo yum install git 
# install mercurial to download galaxy
sudo yum install mercurial
{% endhighlight %}

Install Galaxy
--------------

### Switch to galaxy user

{% highlight bash %}
su galaxy
cd ~
{% endhighlight %}

### Download galaxy

{% highlight bash %}
hg clone https://bitbucket.org/galaxy/galaxy-dist
{% endhighlight %}

### Download virtualenv

{% highlight bash %}
wget https://raw.github.com/pypa/virtualenv/master/virtualenv.py
{% endhighlight %}

### Create sand-boxed Python using virtualenv

{% highlight bash %}
python ./virtualenv.py --no-site-packages galaxy_env
. ./galaxy_env/bin/activate
which python
# ~/galaxy_env/bin/python
{% endhighlight %}

### Configure galaxy user

Edit `~/.bashrc` to define `TEMP` and to add virtualenv source

{% highlight bash %}
source ~/galaxy_env/bin/activate

TEMP=$HOME/galaxy-dist/database/tmp 
export TEMP 
{% endhighlight %}

Ensure that `~/.bash_profile` sources `~/.bashrc`

{% highlight bash %}
# this should be in ~/.bash_profile
if [ -f ~/.bashrc ]; then
	. ~/.bashrc
fi
{% endhighlight %}

Setup PostgreSQL database for Galaxy
------------------------------------

Login as postgres user

{% highlight bash %}
sudo su - postgres
{% endhighlight %}

Use createdb to create new database for galaxy

{% highlight bash %}
createdb galaxy_prod
{% endhighlight %}

Connect to database using psql

{% highlight bash %}
psql galaxy_prod
{% endhighlight %}

Create galaxy user for PostgreSQL database

{% highlight sql %}
CREATE USER galaxy WITH PASSWORD 'password';
GRANT ALL PRIVILEGES ON DATABASE galaxy_prod to galaxy;
\q
{% endhighlight %}

Test galaxy PostgreSQL user.

Exit out of postgres user. Return to galaxy user and then attempt to connect to database.

