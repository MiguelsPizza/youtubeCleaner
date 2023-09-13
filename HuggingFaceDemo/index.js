import { pipeline, env, AutoModel, AutoTokenizer } from "@xenova/transformers"

const videoTitles = [
  "Introduction to Quantum Physics: A Comprehensive Guide",
  "10 EASY Ways to Look INSTANTLY More ATTRACTIVE",
  "Crash Course: Molecular Biology and Genetics",
  "REAL Ghost Caught on Camera - You WON'T BELIEVE This!",
  "The History and Future of AI: An In-depth Analysis",
  "Make $5000 a Day With This One SIMPLE Trick!",
  "Understanding Climate Change: Impact and Solutions",
  "10 Weirdest Things Ever Sold on eBay!",
  "Exploring the Theories of General and Special Relativity",
  "SHOCKING: Celebrity Plastic Surgery Disasters!",
  "Step-by-Step Guide to Learning Python for Beginners",
  "HILARIOUS Prank Calls to Fast Food Restaurants!",
  "Advanced Topics in Organic Chemistry: A Complete Study",
  "Why the World is FLAT: Unbelievable PROOF!",
  "Economic Impact of the Pandemic: An Expert Roundtable",
  "The SCARIEST Haunted Houses in America!",
  "Mastering Calculus: Detailed Video Course",
  "TOP 10 Instant KARMA Moments Caught on LIVE TV!",
  "Exploring the Fundamentals of Blockchain and Cryptocurrency",
  "WIN Every Fortnite Game with This UNBEATABLE Strategy!"
];

const task = 'zero-shot-classification';
const model = 'Xenova/distilbert-base-uncased-mnli';

(async function(){
const classifier = await pipeline(task, model, {progress_callback: (data) => { console.log({pipeline: data})}})
const sequence_to_classify = "Last week I upgraded my iOS version and ever since then my phone has been overheating whenever I use your app."
const candidate_labels = ["mobile", "website", "billing", "account access"]
const output = await classifier(sequence_to_classify, candidate_labels)
console.log({output})
})()