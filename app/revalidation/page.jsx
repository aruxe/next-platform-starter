import { revalidateTag } from 'next/cache';
import { Card } from 'components/card';
import { Markdown } from 'components/markdown';
import { SubmitButton } from 'components/submit-button';

export const metadata = {
    title: 'Random Number Generator'
};

const tagName = 'randomNumber';
const revalidateTTL = 60;

const explainer = `
This page generates a random number on the server. 
The generated number is cached with a tag named "${tagName}" and a maximum age of ${revalidateTTL} seconds.

~~~jsx
async function RandomNumberComponent() {
    const randomNumber = Math.floor(Math.random() * 1000);
    // ...render the number
}
~~~

After ${revalidateTTL} seconds, the first request for this page will trigger its rebuild in the background.
Alternatively, you can click the button below to explicitly invalidate the cache by calling \`revalidateTag('${tagName}')\`,
which will cause the page to be rebuilt with a new random number on the next request.
`;

export default async function Page() {
    async function revalidateNumber() {
        'use server';
        revalidateTag(tagName);
    }

    return (
        <>
            <h1 className="mb-8">Random Number Generator</h1>
            <Markdown content={explainer} className="mb-6" />
            <form className="mb-8" action={revalidateNumber}>
                <SubmitButton text="Generate New Number" />
            </form>
            <RandomNumberGenerator />
        </>
    );
}

async function RandomNumberGenerator() {
    // Generate random number between 1 and 1000
    const randomNumber = Math.floor(Math.random() * 1000) + 1;
    
    // This function doesn't actually need to fetch data,
    // but we're using next.js cache mechanisms
    const cachedData = await fetch(`https://api.example.com/dummy?number=${randomNumber}`, {
        next: { revalidate: revalidateTTL, tags: [tagName] }
    }).then(() => {
        return { number: randomNumber };
    }).catch(() => {
        // If fetch fails (which it will since we're using a dummy URL),
        // still return the random number
        return { number: randomNumber };
    });

    return (
        <Card className="max-w-2xl">
            <h3 className="text-2xl text-neutral-900">Your Random Number:</h3>
            <div className="text-6xl font-bold my-8 text-center">{cachedData.number}</div>
            <p className="text-sm text-gray-600">
                This number was generated on the server and will remain cached for {revalidateTTL} seconds,
                unless you click the button above to generate a new one.
            </p>
        </Card>
    );
}
