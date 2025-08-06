<script lang="ts">
	import type { PageData } from './$types';

	let { data } = $props();
</script>

<div class="space-y-12">
	<section id="new-listings">
		<h2 class="text-3xl font-bold text-heading mb-6">New Job Listings</h2>
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
			{#each Array(4) as square}
				<div
					class="bg-foreground rounded-xl shadow-lg border border-body p-6 hover:shadow-xl transition-shadow"
				>
					<div class="h-12 bg-background rounded-lg animate-pulse mb-4"></div>
					<div class="h-4 bg-background rounded-md animate-pulse w-3/4 mb-2"></div>
					<div class="h-4 bg-background rounded-md animate-pulse w-1/2"></div>
				</div>
			{/each}
		</div>
	</section>

	<section id="recent-applications">
		<div class="flex justify-between items-center mb-6">
			<h2 class="text-3xl font-bold text-heading">Recent Applications</h2>
			<a
				href="/applications/new"
				class="font-semibold border text-heading px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all bg-primary hover:bg-opacity-80"
			>
				Add Application
			</a>
		</div>
		<div class="bg-foreground rounded-xl shadow-lg border border-body overflow-hidden">
			<table class="min-w-full">
				<thead class="bg-background border-b border-body">
					<tr>
						<th class="p-4 text-left text-sm font-semibold text-body tracking-wider">COMPANY</th>
						<th class="p-4 text-left text-sm font-semibold text-body tracking-wider">ROLE</th>
						<th class="p-4 text-left text-sm font-semibold text-body tracking-wider">STATUS</th>
						<th class="p-4 text-left text-sm font-semibold text-body tracking-wider">APPLIED ON</th>
					</tr>
				</thead>
				<tbody>
					{#each data.applications as app}
						<tr class="border-b border-body/50 hover:bg-background/50 transition-colors">
							<td class="p-4 whitespace-nowrap font-medium">{app.company}</td>
							<td class="p-4 whitespace-nowrap text-body">{app.role}</td>
							<td class="p-4 whitespace-nowrap text-body">{app.status}</td>
							<td class="p-4 whitespace-nowrap text-body">{app.appliedAt.toDateString()}</td>
						</tr>
					{:else}
						<tr>
							<td colspan="4" class="text-center p-8 text-body"
								>You haven't added any applications yet.</td
							>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</section>
</div>
