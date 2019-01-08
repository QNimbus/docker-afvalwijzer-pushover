# docker-afvalwijzer-pushover

## Supported environment variables

| Variable name        | Required? |      Default value      | Description |
|----------------------|:---------:|:-----------------------:|-------------|
| PUSHOVER_USER        |     Y     |                         | Your Pushor user key            |
| PUSHOVER_TOKEN       |     Y     |                         | Pushover application token            |
| PUSHOVER_TITLE       |     N     | 'Container herinnering' | Title for notificagtion message            |
| PUSHOVER_SOUND       |     N     |        'tugboat'        | Sound used for notification            |
| PUSHOVER_PRIORITY    |     N     |            0            | Priority            |
| DAYOFFSET            |     N     |            0            | 0=today, 1=tomorrow, et cetera            |
| ZIPCODE              |     Y     |                         | Zipcode             |
| HOUSENUMBER          |     Y     |                         | House address number (e.g. 73)            |
| HOUSENUMBER_ADDITION |     N     |            *emtpy*           | House address number addition (e.g. 'a')            |

## Usage

`docker run --rm --name afvalwijzer_test -e PUSHOVER_USER='*pushover_user_token*' -e PUSHOVER_TOKEN='*pushover_api_token*' -e DAYSOFFSET='0' -e ZIPCODE='1234AB' -e HOUSENUMBER='13' qnimbus-node-afvalwijzer`