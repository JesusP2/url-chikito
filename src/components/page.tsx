import { BackgroundBeamsWithCollision } from './ui/background-beam-with-collision';
import { PlaceholdersAndVanishInput } from './ui/placeholder-and-vanish-input';
import { TypewriterEffectSmooth } from './ui/typewriter-effect';
import { actions } from 'astro:actions';
import { cn } from '../lib/utils';
import crc32 from 'crc/crc32';
import { useState } from 'react';
import { Copy, Check } from "lucide-react"
import { PUBLIC_URL } from 'astro:env/client';

const words = [
  {
    text: "See",
  },
  {
    text: "before",
  },
  {
    text: "you",
  },
  {
    text: "click:",
  },
  {
    text: "Simple",
    className: "text-blue-500 dark:text-blue-500",
  },
  {
    text: "URL",
  },
  {
    text: "shortener",
  },
  {
    text: "with",
  },
  {
    text: "link",
  },
  {
    text: "preview.",
    className: "text-blue-500 dark:text-blue-500",
  },
];
const placeholders = [
  "www.youtube.com",
  "www.google.com",
  "www.x.com",
];


export default function Home() {
  const [hash, setHash] = useState('')
  const [isCopied, setIsCopied] = useState(false)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(`${PUBLIC_URL}/${hash}`)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000) // Reset after 2 seconds
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }
  return (
    <BackgroundBeamsWithCollision className="flex flex-col px-10">
      <h2 className="relative z-20 text-5xl font-bold text-center text-black dark:text-white font-sans tracking-tight">
        URL <span className="text-blue-500 dark:text-purple-500">Chikito</span>
      </h2>
      <div className="flex flex-col items-center my-6">
        <TypewriterEffectSmooth words={words.slice(0, 5)} />
        <TypewriterEffectSmooth words={words.slice(5)} />
      </div>

      <form
        className={cn(
          "w-full relative max-w-xl mx-auto bg-white dark:bg-zinc-800 h-12 rounded-full overflow-hidden shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),_0px_1px_0px_0px_rgba(25,28,33,0.02),_0px_0px_0px_1px_rgba(25,28,33,0.08)] transition duration-200",
        )}
        onSubmit={async (e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget)
          const url = formData.get('url') as string;
          const { data: hash, error } = await actions.shortenUrl({
            url,
          })
          console.log(hash, error)
          if (hash) {
            setHash(hash)
          }
        }}
      >
        <PlaceholdersAndVanishInput
          placeholders={placeholders}
        />
      </form>
      <div className={cn({
        "flex flex-col items-center mt-4 gap-x-4 gap-y-4 invisible": true,
        "visible": !!hash,
      })}>
        <div className="flex items-center gap-x-4">
          <input
            type="text"
            disabled
            className="rounded-lg border border-neutral-800 max-w-[270px] w-full p-2 px-4 bg-neutral-950 text-stone-300 placeholder:text-neutral-700"
            value={`${PUBLIC_URL}/${hash}`}
          />
          <button
            onClick={copyToClipboard}
            aria-label={isCopied ? "Copied" : "Copy to clipboard"}
            className="h-[42px] px-3 rounded-md bg-[#000103] border border-slate-800 text-neutral-100 text-sm hover:-translate-y-1 transform transition duration-200 hover:shadow-md"
          >
            {isCopied ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </button>
        </div>
        <button
          onClick={() => setHash('')}
          className="inline-flex w-[200px] h-[42px] px-3 animate-shimmer items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] font-medium text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
          Shorten another
        </button>
      </div>
    </BackgroundBeamsWithCollision>
  );
}
