# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a single-page responsive website for Lord Chris Smith's campaign to become Chancellor of the University of Cambridge. The website showcases his challenges, endorsements from supporters, timeline of his career, and voting information.

## Site Structure

- `index.html`: The main HTML file containing the entire website
- `statement.txt`: Chris Smith's challenges statement
- `endorsements.txt`: Collection of endorsements from notable supporters
- `timeline.json`: JSON data containing Chris Smith's career timeline
- `news.json`: JSON data containing news articles about the campaign
- `images.src/`: Original source images
- `images/`: Processed responsive WebP images in various sizes

## Content Management

The site content is primarily managed through:
- `statement.txt`: Contains the main campaign challenges
- `endorsements.txt`: Contains endorsements from supporters
- `timeline.json`: Contains chronological data about Chris Smith's career
- `news.json`: Contains news articles related to the campaign

## Image Management

Images are stored in two directories:
- `images.src/`: Original source images
- `images/`: Processed WebP images at various resolutions

The `images/index.json` file maps the relationship between original images and their responsive variants.