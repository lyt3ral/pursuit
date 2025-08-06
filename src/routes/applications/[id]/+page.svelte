<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div
	class="max-w-4xl mx-auto bg-foreground rounded-xl shadow-lg border border-border overflow-hidden"
>
	{#if data.application}
		<div class="p-6 border-b border-border">
			<h2 class="text-3xl font-bold text-heading">{data.application.role}</h2>
			<p class="text-xl text-body">at {data.application.company}</p>
		</div>
		<div class="p-6">
			<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
				<div class="bg-background p-4 rounded-lg border border-border">
					<p class="font-semibold text-body">Status</p>
					<p class="text-lg text-heading">{data.application.status}</p>
				</div>
				<div class="bg-background p-4 rounded-lg border border-border">
					<p class="font-semibold text-body">Job Type</p>
					<p class="text-lg text-heading">{data.application.type}</p>
				</div>
				<div class="bg-background p-4 rounded-lg border border-border">
					<p class="font-semibold text-body">Work Model</p>
					<p class="text-lg text-heading">{data.application.model}</p>
				</div>
				<div class="bg-background p-4 rounded-lg border border-border">
					<p class="font-semibold text-body">Location</p>
					<p class="text-lg text-heading">{data.application.location}</p>
				</div>
				<div class="bg-background p-4 rounded-lg col-span-1 md:col-span-2 border border-border">
					<p class="font-semibold text-body">Applied On</p>
					<p class="text-lg text-heading">{data.application.appliedAt.toDateString()}</p>
				</div>
				{#if data.application.notes}
					<div class="bg-background p-4 rounded-lg col-span-1 md:col-span-2 border border-border">
						<p class="font-semibold text-body">Notes</p>
						<p class="text-lg text-heading">{data.application.notes}</p>
					</div>
				{/if}
			</div>
		</div>
	{:else}
		<div class="p-8 text-center">
			<h1 class="text-2xl font-bold text-heading">Application not found</h1>
			<p class="text-body mt-2">The application you are looking for does not exist.</p>
		</div>
	{/if}
</div>
