# Platform notes

What each platform lets an app do when publishing a post. Each row must be checked against the platform's current official documentation before it is relied on, and the source recorded. Rows marked Unverified have not been checked yet. X and LinkedIn were checked from official documentation on 2026-10-20 (see the details below the table), but some cells are still open.

| Platform | Can an app create a post? | Account type needed | Cost or limits | Approval or review needed | Source | Status |
|---|---|---|---|---|---|---|
| X | Yes, through the API's Post: Create action | to verify | Pay per use with credits bought upfront. Post: Create costs $0.015, and $0.20 if the post contains a URL. Rate limits not stated on the pricing page | The pricing page mentions none | [X API pricing](https://docs.x.com/x-api/getting-started/pricing) | Partly verified (2026-10-20) |
| LinkedIn | Yes, for a member's own profile through the Posts API, with the `w_member_social` scope | A LinkedIn account plus a developer app with the Share on LinkedIn product added. Company pages also need an admin-type role on the page | No price found. Older docs list 150 requests per member per day and 100,000 per app per day | The pages checked do not state a review for `w_member_social`. Not confirmed in practice | [Share on LinkedIn](https://learn.microsoft.com/en-us/linkedin/consumer/integrations/self-serve/share-on-linkedin), [Posts API](https://learn.microsoft.com/en-us/linkedin/marketing/community-management/shares/posts-api?view=li-lms-2026-03) | Partly verified (2026-10-20) |
| YouTube | to verify (community posts in particular) | to verify | to verify | to verify | | Unverified |
| Instagram | to verify | to verify (likely a Business or Creator account) | to verify | to verify (likely app review) | | Unverified |
| Discord | to verify (webhooks are a likely route) | to verify | to verify | to verify | | Unverified |
| GitHub | to verify | to verify | to verify | to verify | | Unverified |

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

## Open questions

- Is any review needed in practice before `w_member_social` works for a personal app? Adding the product in the developer portal will show.
- Which account type does X require for the API, and what are its current rate limits? Check the X rate limit and Developer Console pages.
- How does an X post carry images or video, and what does that cost?
- Should Scribe avoid URLs in X posts because of the $0.20 price, or accept the cost?
- How are each platform's logins and tokens stored safely?
- How are images and video uploaded and sized for each platform?
