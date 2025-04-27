# Embers: Turn Down the Heat on Risk 🔥🏡

Every year, many regions around the world, specially California, faces one of the biggest natural disaster challenges in the world: Wildfires. We built Embers because we believe your valuables are more than objects—they represent deep-rooted memories and a lifetime of hard work. Our mission is simple: use the best technology we have to protect everything you care about **before disaster strikes**.

## How It Works 🖥️

Embers has the ability to transform a simple house tour video into a powerful financial safety tool. 

- **Smart Video Analysis:** Upload a short walkthrough of your home—Embers automatically detects your valuables using advanced computer vision (Ultralytics YOLO v11), saving you hours and hours of manual documentation. ✨ Gone are the days of regret, immediately after the natural disaster leaves you with nothing, when you wish you recorded all valuables down on paper.

- **Snapshot Cataloging:** We crop and organize your items into clear, individual snapshots—giving you an inventory you can actually use. 🖼️

- **Multimodal Valuation (Gemini 2.0/2.5):** Every detected item is intelligently analyzed by Google Gemini 2.0/2.5, combining image understanding, logical reasoning, and market data to estimate replacement values—without you having to lift a finger. From images to audio files, Embers knows that Gemini can do it all 💎

- **Voice Commands:** You can interact with Embers using natural voice prompts using the voice assistant. Just say, “What’s the estimated value of my 2022 42-inch LG TV?” and Embers will pull the relevant valuations instantly, making access easier and hands-free. 🗣️🎤 

- **Safe Data Storage with Supabase:** All your valuables, valuations, and video records are safely encrypted and stored using Supabase’s powerful backend services—ensuring fast access and strong protection—giving you a peace of mind. 🔒🚀

## The Problem We Solved ☑️

Here's what homeowners face today:

- **Documentation Gaps:** Most people never document their valuables properly—and realize it too late. 📄

- **Insurance Disputes:** Without proof of value, many families receive far less compensation than they deserve. 💵

- **Tedious Processes:** Manual photo-by-photo inventories are exhausting, time-consuming, and easy to neglect. Hard-to-reach insurance agents don't make this process any easier. ⏱️

Embers solves these challenges through quick, automatic valuations and personalized protection plans. In just **minutes**, you can create an **ironclad** 🪨 record of what matters most.

## Conquering Challenges 👊

We know that building Embers wasn’t easy, but we also know that is was **definitely** worth it:

- **Visual Clutter:** A normal home tour can have dozens of items in each room, overlapping and changing angles. We solved this with multi-frame object deduplications and non-max suppression to prevent overcounting. 🎯

- **Valuation Complexity:** Not every chair, TV, or ring is created equal. We effectively used Gemini’s multimodal reasoning—letting it infer condition, brand hints, and adjust valuations intelligently even from subtle visual clues. 🧠

- **Supabase Challenges:** We struggled with handling nested JSON columns for image paths, sizes, and detection metadata while keeping queries efficient. 🔄 Ultimately, we solved it by designing lightweight, normalized tables where item records referenced image storage URLs separately—allowing fast, scalable access without overwhelming our main inventory tables. 🌟

## What We Are Proud Of ❤️

- **Effortless:** A short 2-minute house video turns into a complete digital inventory—with almost no effort from the user.

- **Accurate:** Gemini 2.5’s multimodal reasoning ensures valuations are intelligent, realistic, and tailored to each user's situation. 💯

- **Wide Reach:** Embers is built to work for homeowners, renters, and small businesses across the country—not just wildfire zones. 🌍

- **Scalable Architecture:** Designing a clean, efficient backend with Supabase and lightweight relational structures means Embers can scale from a single user to thousands—handling millions of valuable items without slowing down. 🔥💾

## What's Next for Embers 🚀

We’re just getting started. Here’s where Embers is headed next:

- **Post-Fire Damage Auto-Comparison:** After a fire, users will be able to upload a second walkthrough, and Embers will automatically highlight destroyed or missing items—creating a loss report in minutes. ⏳

- **Instant Insurance Claim Generation:** We plan to partner with traditional insurance firms to integrate claims formatting, allowing users to export a ready-to-submit insurance report directly from Embers, cutting weeks off traditional claims processes. 

- **Mobile App Development:** We’re building a mobile app experience so you can record, review, and protect your assets on the go—with offline syncing and easy insurance sharing built in. 📱

- **Enhanced Personalization with AI:** Embers can use your home location, style, and item history to deliver more accurate valuations and proactive protection recommendations tailored just for you. 📈

## Final Thoughts 💭

Embers is built on a simple truth: 
When disaster strikes, no one should ever have to start from zero again.

With just a few minutes of effort today, Embers empowers families to rebuild faster, recover smarter, and protect the memories that truly matter.

This is more than a tool. 
It’s peace of mind, built by technology—and driven by heart. ❤️🔥
