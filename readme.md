

``` json
{
  "startTime": "2026-02-25T10:00:00.000Z",
  "endTime": "2026-02-25T11:00:00.000Z"
}
```


Breaking Down the Format
To ensure you can adjust this later, here is what each part of that string represents:

2026-02-25: The date (Year-Month-Day).

T: The separator between the date and the time.

10:00:00: The actual time (Hours:Minutes:Seconds). This fits your 09:00–12:00 window perfectly.

.000: Milliseconds (usually required by Prisma/Database engines).

Z: Stands for Zulu time (UTC).

A Quick Tip on Timezones: > If your server is set to a local timezone (like EST or WAT) but you send the time with a Z, the database might shift the hour to match UTC. If your 10:00 AM keeps showing up as 11:00 AM or 9:00 AM in your database, you may need to remove the Z or adjust the offset (e.g., +01:00).
