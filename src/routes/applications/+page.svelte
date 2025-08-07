<script lang="ts">
	import type { PageData } from './$types';
	import { Eye, Pencil, ChevronLeft, ChevronRight, Search, X, Plus } from '@lucide/svelte';
	import { goto } from '$app/navigation';

	export let data: PageData;
	let searchQuery = data.searchQuery;
	let searchField = data.searchField;

	function updatePage(page: number) {
		const url = new URL(window.location.origin + window.location.pathname);
		url.search = data.searchParams ?? '';
		url.searchParams.set('page', page.toString());
		if (searchQuery) {
			url.searchParams.set('query', searchQuery);
			url.searchParams.set('field', searchField ?? '');
		}
		goto(url.toString());
	}

	function clearSearch() {
		searchQuery = '';
		goto('/applications');
	}

	function getPageNumbers() {
		const total = data.totalPages;
		const current = data.currentPage;

		if (total <= 7) {
			// Show all pages if 7 or fewer
			return Array.from({ length: total }, (_, i) => i + 1);
		}

		if (current <= 4) {
			// Show 1,2,3,4,5...last
			return [1, 2, 3, 4, 5, '...', total];
		}

		if (current >= total - 3) {
			// Show 1...last-4,last-3,last-2,last-1,last
			return [1, '...', total - 4, total - 3, total - 2, total - 1, total];
		}

		// Show 1...current-1,current,current+1...last
		return [1, '...', current - 1, current, current + 1, '...', total];
	}
</script>

<div class="space-y-8">
	<div class="flex justify-between items-center">
		<h2 class="text-3xl font-bold text-heading">Your Applications</h2>
		<div
			class="font-semibold gap-1 text-heading px-4 py-2 flex items-center rounded-lg shadow-md hover:shadow-lg transition-all bg-primary hover:bg-primary-hover cursor-pointer"
		>
			<Plus size={16} class="mt-0.5" />
			<a href="/applications/new"> Add Application </a>
		</div>
	</div>

	<div class="bg-foreground rounded-xl shadow-lg border border-border overflow-hidden p-6">
		<form method="GET" class="flex items-center gap-4 mb-6">
			<select
				name="field"
				class="border border-border pl-4 pr-10 py-2 rounded-lg bg-background text-body focus:ring-primary focus:border-primary"
				bind:value={searchField}
			>
				<option value="company">Company</option>
				<option value="role">Role</option>
				<option value="status">Status</option>
				<option value="type">Type</option>
				<option value="model">Model</option>
				<option value="location">Location</option>
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

		<div class="overflow-x-auto">
			<table class="min-w-full">
				<thead class="bg-background border-b border-border">
					<tr>
						<th class="p-4 text-left text-sm font-semibold text-body tracking-wider">COMPANY</th>
						<th class="p-4 text-left text-sm font-semibold text-body tracking-wider">ROLE</th>
						<th class="p-4 text-left text-sm font-semibold text-body tracking-wider">STATUS</th>
						<th class="p-4 text-left text-sm font-semibold text-body tracking-wider">TYPE</th>
						<th class="p-4 text-left text-sm font-semibold text-body tracking-wider">MODEL</th>
						<th class="p-4 text-left text-sm font-semibold text-body tracking-wider">LOCATION</th>
						<th class="p-4 text-left text-sm font-semibold text-body tracking-wider">APPLIED ON</th>
						<th class="p-4 text-left text-sm font-semibold text-body tracking-wider">ACTIONS</th>
					</tr>
				</thead>
				<tbody>
					{#each data.applications as app}
						<tr class="border-b border-border/50 hover:bg-background/50 transition-colors">
							<td class="p-4 whitespace-nowrap font-medium text-heading">{app.company}</td>
							<td class="p-4 whitespace-nowrap text-body">{app.role}</td>
							<td class="p-4 whitespace-nowrap text-body">{app.status}</td>
							<td class="p-4 whitespace-nowrap text-body">{app.type}</td>
							<td class="p-4 whitespace-nowrap text-body">{app.model}</td>
							<td class="p-4 whitespace-nowrap text-body">{app.location}</td>
							<td class="p-4 whitespace-nowrap text-body">{app.appliedAt.toDateString()}</td>
							<td class="p-4 whitespace-nowrap text-body">
								<div class="flex gap-2">
									<a
										href="/applications/{app.id}"
										class="text-body hover:text-primary transition-colors"
									>
										<Eye size={20} />
									</a>
									<a
										href="/applications/update/{app.id}"
										class="text-body hover:text-primary transition-colors"
									>
										<Pencil size={20} />
									</a>
								</div>
							</td>
						</tr>
					{:else}
						<tr>
							<td colspan="8" class="text-center p-8 text-body">No applications found.</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		{#if data.totalPages > 1}
			<div class="flex justify-center items-center gap-1 mt-6">
				<button
					class="p-2 rounded-md bg-background hover:bg-background/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
					on:click={() => updatePage(data.currentPage - 1)}
					disabled={data.currentPage === 1}
					aria-label="Previous page"
				>
					<ChevronLeft size={16} class="text-body" />
				</button>

				{#each getPageNumbers() as pageNum}
					{#if typeof pageNum === 'string'}
						<span class="px-2 py-1 text-body text-sm">...</span>
					{:else}
						<button
							class="px-3 py-1 text-sm transition-colors hover:underline {data.currentPage ===
							pageNum
								? 'text-primary font-medium'
								: 'text-body hover:text-heading'}"
							on:click={() => updatePage(pageNum)}
						>
							{pageNum}
						</button>
					{/if}
				{/each}

				<button
					class="p-2 rounded-md bg-background hover:bg-background/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
					on:click={() => updatePage(data.currentPage + 1)}
					disabled={data.currentPage === data.totalPages}
					aria-label="Next page"
				>
					<ChevronRight size={16} class="text-body" />
				</button>
			</div>
		{/if}
	</div>
</div>
