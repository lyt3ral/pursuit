<script lang="ts">
	import type { PageData } from './$types';
	import { Eye, Pencil } from '@lucide/svelte';

	export let data: PageData;
</script>

<div class="p-8 bg-red-300 min-h-screen">
	<div class="flex justify-between items-center">
		<h1 class="text-2xl font-serif">your applications</h1>
		<a
			href="/"
			class="font-medium bg-yellow-200 px-4 py-2 border rounded transition hover:bg-yellow-300 cursor-pointer"
		>
			Back
		</a>
	</div>

	<div class="mx-auto mt-12 rounded-lg">
		<div class="flex justify-between items-center mb-4">
			<form method="GET" class="flex items-center gap-2">
				<select name="field" class="border p-2 rounded bg-white pr-8">
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
					class="border p-2 rounded bg-white"
					placeholder="Search..."
				/>
				<button
					type="submit"
					class="bg-blue-200 border px-4 py-2 rounded hover:bg-blue-300 transition">Search</button
				>
				<a
					href="/applications"
					class="bg-yellow-200 border px-4 py-2 rounded hover:bg-yellow-300 transition">Clear</a
				>
			</form>
			<a
				href="/application/new"
				class="bg-blue-200 border px-4 py-2 rounded hover:bg-blue-300 transition">Add New</a
			>
		</div>

		<div class="overflow-y-auto border">
			<table class="min-w-full bg-white">
				<thead>
					<tr>
						<th
							class="sticky top-0 bg-blue-200 py-3 px-6 text-left text-xs font-medium tracking-wider"
							>COMPANY</th
						>
						<th
							class="sticky top-0 bg-blue-200 py-3 px-6 text-left text-xs font-medium tracking-wider"
							>ROLE</th
						>
						<th
							class="sticky top-0 bg-blue-200 py-3 px-6 text-left text-xs font-medium tracking-wider"
							>STATUS</th
						>
						<th
							class="sticky top-0 bg-blue-200 py-3 px-6 text-left text-xs font-medium tracking-wider"
							>TYPE</th
						>
						<th
							class="sticky top-0 bg-blue-200 py-3 px-6 text-left text-xs font-medium tracking-wider"
							>MODEL</th
						>
						<th
							class="sticky top-0 bg-blue-200 py-3 px-6 text-left text-xs font-medium tracking-wider"
							>LOCATION</th
						>
						<th
							class="sticky top-0 bg-blue-200 py-3 px-6 text-left text-xs font-medium tracking-wider"
							>APPLIED ON</th
						>
						<th
							class="sticky top-0 bg-blue-200 py-3 px-6 text-left text-xs font-medium tracking-wider"
							>ACTIONS</th
						>
					</tr>
				</thead>
				<tbody>
					{#each data.applications as app}
						<tr class="hover:bg-gray-50">
							<td class="py-4 px-6 whitespace-nowrap text-sm font-medium text-gray-900"
								><a href="/applications/{app.id}" class="hover:underline">{app.company}</a></td
							>
							<td class="py-4 px-6 whitespace-nowrap text-sm">{app.role}</td>
							<td class="py-4 px-6 whitespace-nowrap text-sm">{app.status}</td>
							<td class="py-4 px-6 whitespace-nowrap text-sm">{app.type}</td>
							<td class="py-4 px-6 whitespace-nowrap text-sm">{app.model}</td>
							<td class="py-4 px-6 whitespace-nowrap text-sm">{app.location}</td>
							<td class="py-4 px-6 whitespace-nowrap text-sm">{app.appliedAt.toDateString()}</td>
							<td class="py-4 px-6 whitespace-nowrap text-sm">
								<div class="flex gap-2">
									<a href="/applications/{app.id}" class="hover:underline">
										<Eye size={20} />
									</a>
									<a href="/applications/update/{app.id}" class="hover:underline">
										<Pencil size={20} />
									</a>
								</div>
							</td>
						</tr>
					{:else}
						<tr>
							<td colspan="8" class="text-center text-sm py-4 px-6 tracking-wider"
								>no applications found</td
							>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</div>
