<script lang="ts">
	import type { PageData } from './$types';
	import { Search, X, Briefcase, MapPin, Building } from '@lucide/svelte';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	export let data: PageData;
	let searchQuery = data.searchQuery;
	let searchField = data.searchField;

	// Infinite scroll state (client-side slicing of preloaded jobs)
	const PAGE_SIZE = 9;
	let allJobs = data.jobs;
	let jobs = allJobs.slice(0, PAGE_SIZE);
	let page = 1;
	let loading = false;
	let hasMore = jobs.length < allJobs.length;
	let sentinel: HTMLDivElement;
	let observer: IntersectionObserver;

	function loadMoreJobs() {
		if (loading || !hasMore) return;
		loading = true;
		const nextPage = page + 1;
		const nextSlice = allJobs.slice(0, nextPage * PAGE_SIZE);
		jobs = nextSlice;
		page = nextPage;
		hasMore = jobs.length < allJobs.length;
		loading = false;
	}

	onMount(() => {
		observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting && hasMore && !loading) {
					loadMoreJobs();
				}
			},
			{ threshold: 0.1, rootMargin: '200px' }
		);

		if (sentinel) observer.observe(sentinel);

		return () => {
			observer?.disconnect();
		};
	});

	function clearSearch() {
		searchQuery = '';
		goto('/jobs');
	}

	// When a new search query or field comes from server navigation, reset list
	$: if (data.searchQuery !== searchQuery || data.searchField !== searchField) {
		allJobs = data.jobs;
		page = 1;
		jobs = allJobs.slice(0, PAGE_SIZE);
		hasMore = jobs.length < allJobs.length;
	}

	// Re-observe sentinel if it changes
	$: if (sentinel && observer) {
		observer.observe(sentinel);
	}
</script>

<div class="space-y-8">
	<div class="flex justify-between items-center">
		<h2 class="text-3xl font-bold text-heading">Jobs</h2>
	</div>

	<div class="bg-foreground rounded-xl shadow-lg border border-border overflow-hidden p-6">
		<form method="GET" class="flex items-center gap-4 mb-6">
			<select
				name="field"
				class="border border-border pl-4 pr-10 py-2 rounded-lg bg-background text-body focus:ring-primary focus:border-primary"
				bind:value={searchField}
			>
				<option value="role">Role</option>
				<option value="location">Location</option>
				<option value="model">Model</option>
				<option value="type">Type</option>
				<option value="skills">Skills</option>
			</select>
			<div class="flex-1 relative">
				<input
					type="text"
					name="query"
					class="w-full p-2 pr-8 border border-border rounded-lg bg-background text-body focus:ring-primary focus:border-primary"
					placeholder="Search..."
					bind:value={searchQuery}
				/>
				{#if searchQuery}
					<button
						type="button"
						class="absolute right-2 top-1/2 transform -translate-y-1/2 text-body hover:text-heading transition-colors"
						on:click={clearSearch}
						aria-label="Clear search"
					>
						<X size={16} />
					</button>
				{/if}
			</div>
			<button
				type="submit"
				class="p-2 rounded-lg bg-background hover:bg-foreground transition-colors"
				aria-label="Search"
			>
				<Search size={16} class="text-body" />
			</button>
		</form>

		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{#each jobs as job (job.id)}
				<div
					class="bg-background rounded-lg shadow-md border border-border p-6 flex flex-col justify-between"
				>
					<div>
						<a href={job.url} target="_blank" rel="noopener noreferrer">
							<h3 class="text-xl font-bold text-heading mb-2">{job.role}</h3>
						</a>
						<div class="flex items-center gap-2 text-body mb-2">
							<Building size={16} />
							<span>{job.company.name}</span>
						</div>
						<div class="flex items-center gap-2 text-body mb-2">
							<MapPin size={16} />
							<span>{job.location}</span>
						</div>
						<div class="flex items-center gap-2 text-body mb-4">
							<Briefcase size={16} />
							<span class="capitalize">{job.type?.toLowerCase()}</span>
							<span class="capitalize">&bull; {job.model?.toLowerCase()}</span>
						</div>
						<div class="flex flex-wrap gap-2">
							{#each job.skills.split(',') as skill}
								<span
									class="bg-primary/10 text-primary text-xs font-medium px-2.5 py-0.5 rounded-full"
								>
									{skill.trim()}
								</span>
							{/each}
						</div>
					</div>
				</div>
			{:else}
				<div class="col-span-full text-center p-8 text-body">No jobs found.</div>
			{/each}
		</div>

		{#if hasMore}
			<div bind:this={sentinel} class="h-10"></div>
		{/if}

		{#if loading}
			<div class="text-center p-4 text-body">Loading more jobs...</div>
		{/if}
	</div>
</div>
