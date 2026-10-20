# Platform notes

What each platform lets an app do when publishing a post. Each row must be checked against the platform's current official documentation before it is relied on, and the source recorded. All five platforms were checked from official documentation on 2026-10-20 (see the details below the table), but some cells are still open, and nothing has been tested with a real account yet.

| Platform | Can an app create a post? | Account type needed | Cost or limits | Approval or review needed | Source | Status |
|---|---|---|---|---|---|---|
| X | Yes, through the API's Post: Create action | to verify | Pay per use with credits bought upfront. Post: Create costs $0.015, and $0.20 if the post contains a URL. Rate limits not stated on the pricing page | The pricing page mentions none | [X API pricing](https://docs.x.com/x-api/getting-started/pricing) | On hold because it costs money. Partly verified (2026-10-20) |
| LinkedIn | Yes, for a member's own profile through the Posts API, with the `w_member_social` scope | A LinkedIn account plus a developer app with the Share on LinkedIn product added. Company pages also need an admin-type role on the page | No price found. Older docs list 150 requests per member per day and 100,000 per app per day | The pages checked do not state a review for `w_member_social`. Not confirmed in practice | [Share on LinkedIn](https://learn.microsoft.com/en-us/linkedin/consumer/integrations/self-serve/share-on-linkedin), [Posts API](https://learn.microsoft.com/en-us/linkedin/marketing/community-management/shares/posts-api?view=li-lms-2026-03) | Partly verified (2026-10-20) |
| YouTube | Not found. The API reference lists no resource for community posts | n/a | n/a | n/a | [YouTube Data API reference](https://developers.google.com/youtube/v3/docs) | Checked (2026-10-20): no text-update route found |
| Instagram | Yes, through the content publishing API | An Instagram professional account (connected to a Facebook Page on one of the two login routes) | No cost mentioned. 100 API-published posts per 24 hours (the page gives 50 for carousels, so the figure is unclear) | Standard or Advanced Access is needed. The page does not say whether app review is required | [Instagram content publishing](https://developers.facebook.com/docs/instagram-platform/content-publishing/) | Partly verified (2026-10-20) |
| Discord | Yes, through a channel webhook | A server where you can create a webhook (needs the Manage Webhooks permission) | No cost mentioned. Up to 2000 characters of text and 10 embeds per message. Rate limits are not on the webhook page | None. Webhooks need no bot and no authentication | [Discord webhook resource](https://docs.discord.com/developers/resources/webhook) | Partly verified (2026-10-20) |
| GitHub | Yes, as a release with notes. Other kinds of post (Discussions, files in a repo) not checked | A GitHub account and a token with write access to the repository's contents | No cost mentioned. 5,000 requests per hour per user, and at most 80 content-creating requests per minute and 500 per hour | None stated | [Releases API](https://docs.github.com/en/rest/releases/releases), [rate limits](https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api) | Partly verified (2026-10-20) |

## Details found on 2026-10-20

### X

- Pricing is per request from prepaid credits in the Developer Console. No contracts, subscriptions or minimum spend. The page also mentions promotional credits after a first credit purchase.
- Post: Create is $0.015. Post: Create with a URL is $0.20, over thirteen times more. Progress updates that link to GitHub or a project page would hit this price.
- "Media Metadata" is listed as a separate write action at $0.005 per request. The page does not say how images or video are uploaded or what that costs.
- The pricing page does not state rate limits or any approval step.

### LinkedIn

- A member's post needs the `w_member_social` scope, which comes from adding the Share on LinkedIn product to the app in the developer portal. The member signs in through OAuth 2.0.
- Two endpoints appear in the docs. The Share on LinkedIn page uses `POST /v2/ugcPosts`. The newer Posts API uses `POST /rest/posts` with a `Linkedin-Version` header. The Posts API page says version 202510 sunsets on 2026-10-15, so a current version must be used.
- Text, article links, images and video are supported. Images and video must be registered and uploaded first, then referenced in the post. The Posts API page also lists documents, multi-image and polls for ordinary posts. Article posts need the title, description and thumbnail set by the app, because the API does not scrape the URL.
- The rate limits above come from the Share on LinkedIn page and may be out of date. File size and format limits are not stated.
- Posting as a company page needs `w_organization_social` and an admin-type role on that page.

### Discord

- A webhook is a URL for one channel. Posting to it needs no bot, no login and no app review. Treat the URL as a secret.
- A message needs at least one of: text (up to 2000 characters), embeds (up to 10), files, components or a poll. Files go as multipart form data.
- Forum and media channels need a thread id or thread name.

### GitHub

- A release is created with `POST /repos/{owner}/{repo}/releases`. It needs a tag name, and takes a title and a body of notes. It can be a draft, and it sends notifications.
- The token needs write access to the repository's contents. Fine-grained tokens use the Contents write permission.
- Creating content too fast can trigger secondary rate limits.

### Instagram

- Two login routes exist. One uses Instagram Login with `instagram_business_content_publish`. The other uses Facebook Login with `instagram_content_publish` and a Facebook Page. Both need Standard or Advanced Access.
- Media must already be on a public web address when publishing. Images must be JPEG. Videos, reels, stories and carousels (up to 20 items) are supported. Every type listed is media, so a text-only post does not look possible.
- If the connected Page requires Page Publishing Authorization, publishing is blocked until that is done.

### YouTube

- The Data API reference lists no resource for community posts, so an app cannot publish a text update there as far as the docs show. Video upload exists, but that is a different feature.

## Open questions

- What does "publish to GitHub" mean for Scribe: a release with notes, a Discussion, or a file in a repository? Only releases were checked.
- What are Discord's current webhook rate limits? Check the Discord rate limits page.
- Does Instagram require app review in practice, and is publishing worth it given that it needs a professional account and always a JPEG or video?

- Is any review needed in practice before `w_member_social` works for a personal app? Adding the product in the developer portal will show.
- Which account type does X require for the API, and what are its current rate limits? Check the X rate limit and Developer Console pages.
- How does an X post carry images or video, and what does that cost?
- Should Scribe avoid URLs in X posts because of the $0.20 price, or accept the cost?
- How are each platform's logins and tokens stored safely?
- How are images and video uploaded and sized for each platform?
