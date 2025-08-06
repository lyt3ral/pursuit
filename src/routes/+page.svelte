<script lang="ts">
	import type { PageData } from './$types';

	let { data } = $props();
</script>

<div class="space-y-12">
	<section id="new-listings">
		<h2 class="text-3xl font-bold text-[#242423] mb-6">New Job Listings</h2>
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
			{#each Array(4) as _}
				<div class="bg-[#e8eddf] rounded-xl shadow-lg border border-[#333533] p-6 hover:shadow-xl transition-shadow">
					<div class="h-12 bg-[#cfdbd5] rounded-lg animate-pulse mb-4"></div>
					<div class="h-4 bg-[#cfdbd5] rounded-md animate-pulse w-3/4 mb-2"></div>
					<div class="h-4 bg-[#cfdbd5] rounded-md animate-pulse w-1/2"></div>
				</div>
			{/each}
		</div>
	</section>

	<section id="recent-applications">
		<div class="flex justify-between items-center mb-6">
			<h2 class="text-3xl font-bold text-[#242423]">Recent Applications</h2>
			<a href="/application/new" class="font-semibold text-[#242423] px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all bg-[#f5cb5c] hover:bg-opacity-80">
				Add New Application
			</a>
		</div>
		<div class="bg-[#e8eddf] rounded-xl shadow-lg border border-[#333533] overflow-hidden">
			<table class="min-w-full">
				<thead class="bg-[#cfdbd5] border-b border-[#333533]">
					<tr>
						<th class="p-4 text-left text-sm font-semibold text-[#333533] tracking-wider">COMPANY</th>
						<th class="p-4 text-left text-sm font-semibold text-[#333533] tracking-wider">ROLE</th>
						<th class="p-4 text-left text-sm font-semibold text-[#333533] tracking-wider">STATUS</th>
						<th class="p-4 text-left text-sm font-semibold text-[#333533] tracking-wider">APPLIED ON</th>
					</tr>
				</thead>
				<tbody>
					{#each data.applications.slice(0, 5) as app}
						<tr class="border-b border-[#333533]/50 hover:bg-[#cfdbd5]/50 transition-colors">
							<td class="p-4 whitespace-nowrap font-medium">{app.company}</td>
							<td class="p-4 whitespace-nowrap text-[#333533]">{app.role}</td>
							<td class="p-4 whitespace-nowrap text-[#333533]">{app.status}</td>
							<td class="p-4 whitespace-nowrap text-[#333533]">{app.appliedAt.toDateString()}</td>
						</tr>
					{:else}
						<tr>
							<td colspan="4" class="text-center p-8 text-[#333533]">You haven't added any applications yet.</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</section>
</div>
