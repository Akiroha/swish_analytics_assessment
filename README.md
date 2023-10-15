# Swish Analytics Assessment

## Overview

You’ll find 2 JSON files attached of mock data from an NBA game representing 2 API endpoints Swish offers:

- props.json:
  - This represents the optimal betting line being offered for each market, where a
    market is defined as the line for a specific stat type of a player.
    - i.e. for Russell Westbrook, his 4 unique markets and respective optimal lines are
      points(19.0), rebounds(9.0), assists(8.5), and steals(1.5).
- alternates.json:
  - This represents all of the lines offered at one point for a market, and their respective under, over, and push probabilities.
  - i.e. for Russell Westbrook’s points market, there were 5 different lines - 18.5, 19.0, 19.5, 20, and 20.5

## Goal

Build a table representation of the data provided in props.json, where each row represents a market. For each market, also include the low and high lines for that market from alternates.json.

- i.e. for Westbrook’s points, there should be column’s for his low (18.5) and high (20.5)

### Table functionality:

- The ability to filter by position, stat type, and or market status (suspended or not)
- A search bar that filters on player name or team name
- An indication of whether a market is suspended or not (detailed below)

### A market is suspended if any of these 3 cases are true

1. marketSuspended = 1 for that market in props.json
2. That market’s optimal line does not exist in alternates.json. i.e. Jordan Poole points
3. That market exists in alternates.json, but none of the 3 probabilities for the optimal line
   are greater than 40%.
   - i.e. Steph Curry steals. His optimal line is 1, but the under, push, and over probs
     are each under .4

Additionally, for each market/row, add the ability to manually suspend or release. If a manual lock is set, this value will override the value calculated above for that market/row.

- Steph Curry’s assists market, which would initially be suspended due to sub-40% probabilities, could be manually set to unsuspended
- Russell Westbrook’s assists market, initially unsuspended, could manually be suspended

Note: Data management should be done in state - the JSON files do not need to be updated.

## Thought Process

### page.tsx

I decided to handle all of the state here. There are more useEffects than I would regularly use, as well as functions that are being passed down to the 2 child components. If I had more time, I would have handled the state + mutattions in redux. This would result in a much cleaner main component + I wouldn't have to pass down all of the props like I did here.

## filter-actions.tsx

My main goal here was to separate the search field, filter dropwdown, and manual buttons from the main and table components. With more time, I would've probably separated the components further. search.tsx, filter.tsx, suspend-button.tsx, and release-button.tsx to be exact

## Libraries/Tools, Decisions, and Tradeoffs

### Typescript

I come from an OOP background. When I first started getting into Javascript, I loved and embraced it because I was finally free of all the annoying rules that I had to endure in Java. About November of last year, I tried out Typescript and never looked back. The amount of silly syntax errors that it prevents are in the thousands. It also helps with following guidelines while working in a team setting. I love it.

### Tailwind

I love tailwind. CSS is so powerful but because of tailwind's descriptive and plain language syntax, I feel like I can harness the power more

### Next

Next is just my default now when I start a new react app. It comes with so much right out of the box, even though I didn't need all of what makes it great for this assessment, I still used it right away

### Heroicons

I needed something simple for the filter button icon

## What I sacrificed for time

### Global State (React Redux w toolkit)

As I alluded to earlier, dumping everything in the page.tsx isn't my go-to approach. In fact, I would say that I use global state much more than I probably should. Redux toolkit is extremely powerful and convenient, the setup just isn't lol. So I decided to skip out on it

### Unit Testing (Jest)

Unit tests are a must. I have extensive experience with unit tests on the back end and a few months experience writing them for front end. I know how important they are and would've made them a priority if not for the time constraint

### Filter caching

I gotta admit, I REALLY wanted to persist the filters either by search params or session storage. I almost gave in and implemented this but I knew I had to submit this before the busy work week started!
