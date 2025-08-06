<script lang="ts">
	import type { PageData } from './$types';
	import { Eye, Pencil } from '@lucide/svelte';
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
</script>

<div class="space-y-8">
	<div class="flex justify-between items-center">
		<h2 class="text-3xl font-bold text-heading">Your Applications</h2>
		<a
			href="/applications/new"
			class="font-semibold text-heading px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all bg-primary hover:bg-primary-hover cursor-pointer"
		>
			Add Application
		</a>
	</div>

	<div class="bg-foreground rounded-xl shadow-lg border border-border overflow-hidden p-6">
		<form method="GET" class="flex items-center gap-4 mb-6">
			<select
				name="field"
				class="border border-border p-2 rounded-lg bg-background text-body focus:ring-primary focus:border-primary pr-8"
				bind:value={searchField}
			>
				<option value="company">Company</option>
				<option value="role">Role</option>
				<option value="status">Status</option>
				<option value="type">Type</option>
				<option value="model">Model</option>
				<option value="location">Location</option>
			</select>
			<input
				type="text"
				name="query"
				class="flex-1 p-2 border border-border rounded-lg bg-background text-body focus:ring-primary focus:border-primary"
				placeholder="Search..."
				bind:value={searchQuery}
			/>
			<button
				type="submit"
				class="font-medium bg-primary hover:bg-primary-hover cursor-pointer text-heading px-4 py-2 rounded-lg shadow-sm hover:bg-opacity-80 transition-all"
				>Search</button
			>
			<a
				href="/applications"
				class="font-medium bg-primary hover:bg-primary-hover cursor-pointer text-heading px-4 py-2 rounded-lg shadow-sm hover:bg-opacity-80 transition-all"
				>Clear</a
			>
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
			<div class="flex justify-center items-center gap-4 mt-6">
				<button
					class="font-medium bg-primary hover:bg-primary-hover cursor-pointer text-heading px-4 py-2 rounded-lg shadow-sm hover:bg-opacity-80 transition-all"
					on:click={() => updatePage(data.currentPage - 1)}
					disabled={data.currentPage === 1}
				>
					Previous
				</button>
				<span class="text-body">Page {data.currentPage} of {data.totalPages}</span>
				<button
					class="font-medium bg-primary hover:bg-primary-hover cursor-pointer text-heading px-4 py-2 rounded-lg shadow-sm hover:bg-opacity-80 transition-all"
					on:click={() => updatePage(data.currentPage + 1)}
					disabled={data.currentPage === data.totalPages}
				>
					Next
				</button>
			</div>
		{/if}
	</div>
</div>
