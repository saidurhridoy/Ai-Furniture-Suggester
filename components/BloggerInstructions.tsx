
import React, { useState } from 'react';

export const BloggerInstructions: React.FC = () => {
    const iframeCode = `<iframe src="YOUR_PUBLISHED_APP_URL" width="100%" height="800" style="border:none; overflow:hidden;" scrolling="no" frameborder="0" allowTransparency="true" allow="encrypted-media"></iframe>`;
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(iframeCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">How to Embed in Your Blogger Site</h2>
            <p className="text-gray-600 mb-6">
                Follow these simple steps to feature this interactive furniture suggester directly in your Blogger posts.
            </p>

            <div className="space-y-6">
                <div className="flex items-start">
                    <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-indigo-600 text-white font-bold text-lg">1</div>
                    <div className="ml-4">
                        <h3 className="text-lg font-semibold text-gray-700">Publish Your App</h3>
                        <p className="text-gray-600 mt-1">
                            First, you need to build this React application and host it online. Services like <a href="https://www.netlify.com/" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">Netlify</a>, <a href="https://vercel.com/" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">Vercel</a>, or <a href="https://pages.github.com/" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">GitHub Pages</a> offer free hosting for static websites. After deploying, you will get a live URL (e.g., <code className="bg-gray-200 text-sm p-1 rounded">https://my-furniture-app.netlify.app</code>).
                        </p>
                    </div>
                </div>

                <div className="flex items-start">
                    <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-indigo-600 text-white font-bold text-lg">2</div>
                    <div className="ml-4">
                        <h3 className="text-lg font-semibold text-gray-700">Copy the Embed Code</h3>
                        <p className="text-gray-600 mt-1">
                            Copy the HTML code below. You'll need to replace <code className="bg-gray-200 text-sm p-1 rounded">YOUR_PUBLISHED_APP_URL</code> with the actual URL you got in Step 1.
                        </p>
                        <div className="mt-2 relative">
                            <pre className="bg-gray-100 text-gray-800 p-4 rounded-lg text-sm overflow-x-auto">
                                <code>{iframeCode}</code>
                            </pre>
                            <button
                                onClick={handleCopy}
                                className="absolute top-2 right-2 px-3 py-1 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                {copied ? 'Copied!' : 'Copy'}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex items-start">
                    <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-indigo-600 text-white font-bold text-lg">3</div>
                    <div className="ml-4">
                        <h3 className="text-lg font-semibold text-gray-700">Paste in Blogger</h3>
                        <p className="text-gray-600 mt-1">
                            In your Blogger post editor, switch from 'Compose view' to '<b className="font-bold">HTML view</b>'. Find the spot where you want the app to appear and paste the code you just copied. Publish your post, and you're done!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
