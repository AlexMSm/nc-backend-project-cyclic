# Northcoders News API

## Background

I will be building an API for the purpose of accessing application data programmatically. The intention here is to mimic the building of a real world backend service (such as reddit) which should provide this information to the front end architecture.

## Info for cloners

Hi there, please find the link to the hosted version of the app below.

https://als-news-app.herokuapp.com/

Details on the available endpoints can be found at /api.

To clone and run locally:

1. git clone https://github.com/AlexMSm/nc-backend-project.git

2. Create two files '.env.test' and '.env.development' containing the lines 'PGDATABASE=nc_news_test' and 'PGDATABASE=nc_news' respectively, in the top level folder.

3. Set up the database: 'npm setup-dbs'

4. Seed the database: 'npm seed'
