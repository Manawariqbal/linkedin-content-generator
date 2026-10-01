function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-800 bg-slate-900 px-6 py-16 text-center shadow-lg">

      {/* Spinner */}
      <div className="mb-6 h-12 w-12 animate-spin rounded-full border-4 border-slate-700 border-t-blue-500" />

      {/* Heading */}
      <h3 className="text-xl font-semibold text-white">
        Generating your LinkedIn content...
      </h3>

      {/* Description */}
      <p className="mt-3 max-w-lg text-sm leading-6 text-slate-400">
        We're analyzing the profile and creating
        a personalized content strategy.
      </p>

      {/* Note */}
      <p className="mt-2 max-w-lg text-xs leading-5 text-slate-500">
        This may take a little while because the
        LinkedIn profile is being fetched first.
      </p>

    </div>
  );
}

export default LoadingState;