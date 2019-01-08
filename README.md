# docker-afvalwijzer-pushover

## Supported environment variables

| Variable name        | Required? | Description |
|----------------------|:---------:|-------------|
| PUSHOVER_USER        |     Y     | Your Pushover user key            |
| PUSHOVER_TOKEN       |     Y     | Your Pushover application token            |
| DAYOFFSET            |     N     | 0 by default (for today) and 1 for the tomorrow and 2 for the day after tomorrow, et cetera            |
| ZIPCODE              |     Y     | Zipcode            |
| HOUSENUMBER          |     Y     | House address number (e.g. 73)           |
| HOUSENUMBER_ADDITION |     N     | House address number addition (e.g. 'a')            |

## Usage

`docker run --rm --name afvalwijzer_test -e PUSHOVER_USER='*pushover_user_token*' -e PUSHOVER_TOKEN='*pushover_api_token*' -e DAYSOFFSET='0' -e ZIPCODE='1234AB' -e HOUSENUMBER='13' qnimbus-node-afvalwijzer`