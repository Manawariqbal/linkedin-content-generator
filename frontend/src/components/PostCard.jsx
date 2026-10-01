import ReactMarkdown from "react-markdown";

function PostCard({ post, index }) {
  return (
    <article
      className="
        group
        rounded-2xl
        border border-slate-800
        bg-slate-900
        p-6
        shadow-lg
        transition-all
        duration-200
        hover:-translate-y-1
        hover:border-slate-700
        hover:shadow-2xl
      "
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <span
          className="
            rounded-full
            bg-blue-500/10
            px-3
            py-1
            text-sm
            font-semibold
            text-blue-400
          "
        >
          Post {index + 1}
        </span>

        <span
          className="
            rounded-full
            border border-slate-700
            bg-slate-800/60
            px-3
            py-1
            text-xs
            font-medium
            text-slate-300
          "
        >
          {post.contentType}
        </span>
      </div>

      {/* Topic */}
      <h3
        className="
          mt-5
          text-xl
          font-semibold
          leading-7
          text-white
        "
      >
        {post.topic}
      </h3>

      {/* Hook */}
      <div className="mt-6">
        <h4 className="mb-2 text-sm font-semibold uppercase tracking-wide text-blue-400">
          Hook
        </h4>

        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 text-sm leading-6 text-slate-300">
          <ReactMarkdown>
            {post.hook}
          </ReactMarkdown>
        </div>
      </div>

      {/* Post Body */}
      <div className="mt-6">
        <h4 className="mb-2 text-sm font-semibold uppercase tracking-wide text-blue-400">
          Post
        </h4>

        <div
          className="
            rounded-xl
            border border-slate-800
            bg-slate-950/60
            p-5
            text-sm
            leading-7
            text-slate-300
          "
        >
          <ReactMarkdown
            components={{
              p: ({ children }) => (
                <p className="mb-4 last:mb-0">
                  {children}
                </p>
              ),

              strong: ({ children }) => (
                <strong className="font-semibold text-white">
                  {children}
                </strong>
              ),

              ul: ({ children }) => (
                <ul className="mb-4 list-disc space-y-2 pl-5">
                  {children}
                </ul>
              ),

              ol: ({ children }) => (
                <ol className="mb-4 list-decimal space-y-2 pl-5">
                  {children}
                </ol>
              ),

              li: ({ children }) => (
                <li>{children}</li>
              ),
            }}
          >
            {post.body}
          </ReactMarkdown>
        </div>
      </div>

      {/* Call to Action */}
      <div className="mt-6">
        <h4 className="mb-2 text-sm font-semibold uppercase tracking-wide text-blue-400">
          Call to Action
        </h4>

        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 text-sm leading-6 text-slate-300">
          <ReactMarkdown>
            {post.callToAction}
          </ReactMarkdown>
        </div>
      </div>

      {/* Hashtags */}
      {post.hashtags?.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2 border-t border-slate-800 pt-5">
          {post.hashtags.map(
            (hashtag, hashtagIndex) => (
              <span
                key={hashtagIndex}
                className="
                  rounded-full
                  bg-slate-800
                  px-3
                  py-1.5
                  text-xs
                  font-medium
                  text-slate-400
                  transition
                  group-hover:text-blue-400
                "
              >
                {hashtag}
              </span>
            )
          )}
        </div>
      )}
    </article>
  );
}

export default PostCard;