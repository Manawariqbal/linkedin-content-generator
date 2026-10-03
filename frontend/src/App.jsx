import { useState } from "react";

import ProfileForm from "./components/ProfileForm";
import PostCard from "./components/PostCard";
import LoadingState from "./components/LoadingState";

import {
  generateContent,
  generateBatchContent
} from "./services/api";


function App() {
  const [result, setResult] =
    useState(null);

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);


  async function handleGenerate(
    payload
  ) {
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response =
        payload.linkedinUrls
          ? await generateBatchContent(
              payload
            )
          : await generateContent(
              payload
            );

      setResult(response);

    } catch (error) {
      setError(
        error.message ||
        "Failed to generate content"
      );

    } finally {
      setLoading(false);
    }
  }


  function renderTagList(items) {
    if (!Array.isArray(items)) {
      return null;
    }

    return (
      <div className="flex flex-wrap gap-2">
        {items.map(
          (item, index) => (
            <span
              key={index}
              className="
                rounded-full
                bg-blue-50
                px-3
                py-1.5
                text-sm
                font-medium
                text-blue-700
              "
            >
              {item}
            </span>
          )
        )}
      </div>
    );
  }


  function renderProfileAnalysis(
    analysis
  ) {
    if (!analysis) {
      return null;
    }

    return (
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

        <h2 className="mb-6 text-xl font-semibold text-gray-900">
          Profile Analysis
        </h2>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

          <div className="rounded-xl bg-gray-50 p-5">
            <p className="text-sm font-medium text-gray-500">
              Seniority
            </p>

            <p className="mt-2 text-base font-semibold text-gray-900">
              {analysis.seniority || "Not available"}
            </p>
          </div>


          <div className="rounded-xl bg-gray-50 p-5">
            <p className="text-sm font-medium text-gray-500">
              Industry
            </p>

            <p className="mt-2 text-base font-semibold text-gray-900">
              {analysis.industry || "Not available"}
            </p>
          </div>

        </div>


        {analysis.expertise?.length > 0 && (
          <div className="mt-6">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
              Expertise
            </h3>

            {renderTagList(
              analysis.expertise
            )}
          </div>
        )}


        {analysis.targetAudience?.length > 0 && (
          <div className="mt-6">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
              Target Audience
            </h3>

            {renderTagList(
              analysis.targetAudience
            )}
          </div>
        )}


        {analysis.contentThemes?.length > 0 && (
          <div className="mt-6">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
              Content Themes
            </h3>

            {renderTagList(
              analysis.contentThemes
            )}
          </div>
        )}


        {analysis.tone?.length > 0 && (
          <div className="mt-6">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
              Tone
            </h3>

            {renderTagList(
              analysis.tone
            )}
          </div>
        )}


        {analysis.writingStyle && (
          <div className="mt-6">

            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
              Writing Style
            </h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

              <div className="rounded-xl border border-gray-200 p-4">
                <p className="text-xs font-medium text-gray-500">
                  Sentence Length
                </p>

                <p className="mt-1 font-medium text-gray-900">
                  {analysis.writingStyle.sentenceLength || "Not available"}
                </p>
              </div>


              <div className="rounded-xl border border-gray-200 p-4">
                <p className="text-xs font-medium text-gray-500">
                  Uses Stories
                </p>

                <p className="mt-1 font-medium text-gray-900">
                  {analysis.writingStyle.usesStories ? "Yes" : "No"}
                </p>
              </div>


              <div className="rounded-xl border border-gray-200 p-4">
                <p className="text-xs font-medium text-gray-500">
                  Uses Lists
                </p>

                <p className="mt-1 font-medium text-gray-900">
                  {analysis.writingStyle.usesLists ? "Yes" : "No"}
                </p>
              </div>


              <div className="rounded-xl border border-gray-200 p-4">
                <p className="text-xs font-medium text-gray-500">
                  Uses Questions
                </p>

                <p className="mt-1 font-medium text-gray-900">
                  {analysis.writingStyle.usesQuestions ? "Yes" : "No"}
                </p>
              </div>


              <div className="rounded-xl border border-gray-200 p-4">
                <p className="text-xs font-medium text-gray-500">
                  Personal Experience
                </p>

                <p className="mt-1 font-medium text-gray-900">
                  {analysis.writingStyle.usesPersonalExperience
                    ? "Yes"
                    : "No"}
                </p>
              </div>

            </div>

          </div>
        )}


        {analysis.positioning && (
          <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50 p-5">

            <h3 className="text-sm font-semibold uppercase tracking-wide text-blue-700">
              Positioning
            </h3>

            <p className="mt-2 text-sm leading-6 text-gray-700">
              {analysis.positioning}
            </p>

          </div>
        )}

      </section>
    );
  }


  function renderContentStrategy(
    strategy
  ) {
    if (!strategy) {
      return null;
    }

    return (
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

        <h2 className="mb-6 text-xl font-semibold text-gray-900">
          Content Strategy
        </h2>


        {strategy.positioning && (
          <div className="rounded-xl border border-blue-100 bg-blue-50 p-5">

            <h3 className="text-sm font-semibold uppercase tracking-wide text-blue-700">
              Positioning
            </h3>

            <p className="mt-2 text-sm leading-6 text-gray-700">
              {strategy.positioning}
            </p>

          </div>
        )}


        {strategy.targetAudience?.length > 0 && (
          <div className="mt-6">

            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
              Target Audience
            </h3>

            {renderTagList(
              strategy.targetAudience
            )}

          </div>
        )}


        {strategy.contentPillars?.length > 0 && (
          <div className="mt-6">

            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
              Content Pillars
            </h3>

            {renderTagList(
              strategy.contentPillars
            )}

          </div>
        )}


        {strategy.contentIdeas?.length > 0 && (
          <div className="mt-8">

            <h3 className="mb-4 text-lg font-semibold text-gray-900">
              Content Ideas
            </h3>

            <div className="space-y-5">

              {strategy.contentIdeas.map(
                (idea, index) => (

                  <div
                    key={index}
                    className="rounded-xl border border-gray-200 p-5"
                  >

                    <div className="flex flex-wrap items-center justify-between gap-3">

                      <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                        {idea.type}
                      </span>

                      <span className="text-xs font-medium text-gray-400">
                        Idea {index + 1}
                      </span>

                    </div>


                    <h4 className="mt-4 text-lg font-semibold text-gray-900">
                      {idea.topic}
                    </h4>


                    {idea.objective && (
                      <p className="mt-2 text-sm leading-6 text-gray-600">
                        {idea.objective}
                      </p>
                    )}


                    {idea.targetAudience?.length > 0 && (
                      <div className="mt-4">

                        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                          Audience
                        </p>

                        {renderTagList(
                          idea.targetAudience
                        )}

                      </div>
                    )}


                    {idea.keyPoints?.length > 0 && (
                      <div className="mt-5">

                        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                          Key Points
                        </p>

                        <ul className="list-disc space-y-2 pl-5 text-sm leading-6 text-gray-700">

                          {idea.keyPoints.map(
                            (
                              point,
                              pointIndex
                            ) => (
                              <li
                                key={
                                  pointIndex
                                }
                              >
                                {point}
                              </li>
                            )
                          )}

                        </ul>

                      </div>
                    )}


                    {idea.suggestedHook && (
                      <div className="mt-5 rounded-lg bg-gray-50 p-4">

                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                          Suggested Hook
                        </p>

                        <p className="mt-2 text-sm italic leading-6 text-gray-700">
                          {idea.suggestedHook}
                        </p>

                      </div>
                    )}

                  </div>

                )
              )}

            </div>

          </div>
        )}

      </section>
    );
  }


  function renderPosts(posts) {
    if (!posts?.posts) {
      return null;
    }

    return (
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

        <h2 className="mb-5 text-xl font-semibold text-gray-900">
          Generated Posts
        </h2>

        <div className="space-y-5">

          {posts.posts.map(
            (post, index) => (
              <PostCard
                key={index}
                post={post}
                index={index}
              />
            )
          )}

        </div>

      </section>
    );
  }


  function renderSingleResult(data) {
    if (!data) {
      return null;
    }

    return (
      <div className="mt-8 space-y-6">

        {renderProfileAnalysis(
          data.profileAnalysis
        )}

        {renderContentStrategy(
          data.contentStrategy
        )}

        {renderPosts(
          data.posts
        )}

      </div>
    );
  }


  function renderBatchResult(data) {
    if (!data) {
      return null;
    }

    return (
      <div className="mt-8 space-y-6">

        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

          <h2 className="mb-5 text-xl font-semibold text-gray-900">
            Batch Results
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

            <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 text-center">
              <p className="text-3xl font-bold text-gray-900">
                {data.total}
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Total
              </p>
            </div>


            <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 text-center">
              <p className="text-3xl font-bold text-gray-900">
                {data.successful}
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Successful
              </p>
            </div>


            <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 text-center">
              <p className="text-3xl font-bold text-gray-900">
                {data.failed}
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Failed
              </p>
            </div>

          </div>

        </section>


        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

          <h2 className="mb-5 text-xl font-semibold text-gray-900">
            Profiles
          </h2>

          <div className="space-y-5">

            {data.results?.map(
              (item, index) => (

                <div
                  key={index}
                  className="rounded-xl border border-gray-200 p-5"
                >

                  <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

                    <p className="break-all text-sm font-medium text-gray-700">
                      {item.linkedinUrl}
                    </p>

                    {item.success ? (
                      <span className="w-fit rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                        Success
                      </span>
                    ) : (
                      <span className="w-fit rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
                        Failed
                      </span>
                    )}

                  </div>


                  {item.success ? (

                    <div className="space-y-6">

                      {item.data?.profileAnalysis &&
                        renderProfileAnalysis(
                          item.data.profileAnalysis
                        )}

                      {item.data?.contentStrategy &&
                        renderContentStrategy(
                          item.data.contentStrategy
                        )}

                      {item.data?.posts &&
                        renderPosts(
                          item.data.posts
                        )}

                    </div>

                  ) : (

                    <div className="rounded-lg bg-red-50 p-4">

                      <p className="text-sm text-red-700">
                        {item.error}
                      </p>

                    </div>

                  )}

                </div>

              )
            )}

          </div>

        </section>

      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gray-50">

      <header className="border-b border-gray-800 bg-gray-950 text-white">

        <div className="mx-auto max-w-5xl px-4 py-12 text-center sm:px-6">

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            LinkedIn Content Strategy
            Generator
          </h1>

          <p className="mt-3 text-base text-gray-400 sm:text-lg">
            Generate profile-driven
            LinkedIn content using AI.
          </p>

        </div>

      </header>


      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">

        <ProfileForm
          onGenerate={
            handleGenerate
          }
          loading={loading}
        />


        {loading && (
          <div className="mt-8">
            <LoadingState />
          </div>
        )}


        {error && !loading && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4">

            <p className="text-sm font-medium text-red-700">
              {error}
            </p>

          </div>
        )}


        {!loading &&
          result?.data &&
          result.data.results &&
          renderBatchResult(
            result.data
          )}


        {!loading &&
          result?.data &&
          !result.data.results &&
          renderSingleResult(
            result.data
          )}

      </main>

    </div>
  );
}

export default App;