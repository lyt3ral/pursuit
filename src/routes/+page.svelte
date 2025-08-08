<script lang="ts">
	import type { PageData } from './$types';
	import { Eye, Pencil, Plus, Building, MapPin, Briefcase } from '@lucide/svelte';
	import JobCardSkeleton from '$lib/components/JobCardSkeleton.svelte';
	import RecentApplicationsSkeleton from '$lib/components/RecentApplicationsSkeleton.svelte';
	let { data }: { data: PageData } = $props();
</script>

<div class="space-y-12">
	<section id="new-listings">
		<div class="flex items-center justify-between mb-6">
			<h2 class="text-3xl font-bold text-heading">New Job Listings</h2>
			<a href="/jobs" class="text-sm text-primary hover:underline">View all</a>
		</div>
		{#await data.jobs}
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				{#each Array(8) as _}
					<JobCardSkeleton />
				{/each}
			</div>
		{:then jobs}
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				{#each jobs as job (job.id)}
					<div
						class="bg-foreground rounded-xl shadow-lg border border-border p-6 flex flex-col justify-between hover:shadow-xl transition-shadow"
					>
						<div>
							<a href={job.url} target="_blank" rel="noopener noreferrer">
								<h3 class="text-lg font-semibold text-heading mb-2 line-clamp-2">{job.role}</h3>
							</a>
							<div class="flex items-center gap-2 text-body mb-1 text-sm">
								<Building size={14} />
								<span class="truncate">{job.company.name}</span>
							</div>
							<div class="flex items-center gap-2 text-body mb-1 text-xs">
								<MapPin size={14} />
								<span class="truncate">{job.location}</span>
							</div>
							<div class="flex items-center gap-2 text-body mb-3 text-xs">
								<Briefcase size={14} />
								<span class="capitalize">{job.type?.toLowerCase()}</span>
								<span class="capitalize">&bull; {job.model?.toLowerCase()}</span>
							</div>
							<div class="flex flex-wrap gap-1.5">
								{#each job.skills.split(',').slice(0, 3) as skill}
									<span
										class="bg-primary/10 text-primary text-[10px] font-medium px-2 py-0.5 rounded-full"
										>{skill.trim()}</span
									>
								{/each}
								{#if job.skills.split(',').length > 3}
									<span class="text-[10px] text-body">+{job.skills.split(',').length - 3} more</span>
								{/if}
							</div>
						</div>
					</div>
				{:else}
					<div class="col-span-full text-center p-8 text-body">No jobs available.</div>
				{/each}
			</div>
		{/await}
	</section>

	<section id="recent-applications">
		<div class="flex justify-between items-center mb-6">
			<h2 class="text-3xl font-bold text-heading">Recent Applications</h2>
			<div
				class="font-semibold gap-1 text-heading px-4 py-2 flex items-center rounded-lg shadow-md hover:shadow-lg transition-all bg-primary hover:bg-primary-hover cursor-pointer"
			>
				<Plus size={16} class="mt-0.5" />
				<a href="/applications/new"> Add Application </a>
			</div>
		</div>
		{#await data.applications}
			<RecentApplicationsSkeleton />
		{:then applications}
			<div class="bg-foreground rounded-xl shadow-lg border border-border overflow-hidden">
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
						{#each applications as app}
							<tr class="border-b border-border/50 hover:bg-background/50 transition-colors">
								<td class="p-4 whitespace-nowrap font-medium">{app.company}</td>
								<td class="p-4 whitespace-nowrap text-body">{app.role}</td>
								<td class="p-4 whitespace-nowrap text-body">{app.status}</td>
								<td class="p-4 whitespace-nowrap text-body">{app.type}</td>
								<td class="p-4 whitespace-nowrap text-body">{app.model}</td>
								<td class="p-4 whitespace-nowrap text-body capitalize">{app.location}</td>
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
								<td colspan="8" class="text-center p-8 text-body">
									You haven't added any applications yet.
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/await}
	</section>
</div>
