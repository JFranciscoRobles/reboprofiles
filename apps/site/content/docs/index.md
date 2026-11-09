# What is ReboProfiles

ReboProfiles makes the one page someone shares — their photo, what they do, the buttons to reach them, their links, their networks and what they offer — and counts what becomes of it: every visit, where it came from, and every click, by the block it was on.

It is three packages that stand on one engine. The engine has no DOM: the profile is a plain object your application keeps as JSON, and its page is HTML any server gives. The editor writes the profile in a form beside the page as it will look. The server signs the page's links, and is told each visit and each click.

<demo name="editor" />

## What it is for

- **A link in a bio.** The one address in an Instagram, a TikTok or the foot of an email, with everything behind it.
- **The page of each person of a team.** An agent, a doctor, a teacher: each one their own page, made in your application, with what your application has (the homes they sell, the dates they have free) as blocks of its own.
- **Knowing what works.** Which link is touched, from which network the visits come, which campaign brought them, on what they read it.

## What it is not

It is not a service: nothing is kept anywhere but where your application keeps it, and no visit goes to anyone but your server. It is not a site builder either: a profile is one page, one column, made to be read on a phone.

## Where to go from here

- [Getting started](/docs/getting-started/): the editor, the page and the numbers, in a few lines each.
- [Blocks](/docs/blocks/): what a profile may have.
- [Visits and clicks](/docs/tracking/): what is counted, and how.
