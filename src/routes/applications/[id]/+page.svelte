<script lang="ts">
	import type { PageData } from './$types';
	import {
		ArrowLeft,
		Calendar,
		MapPin,
		Building,
		Briefcase,
		Monitor,
		CheckCircle
	} from '@lucide/svelte';

	export let data: PageData;
</script>

<div class="space-y-6">
	<div class="flex items-center">
		<a
			href="/applications"
			class="inline-flex items-center gap-2 text-body hover:text-primary transition-colors"
		>
			<ArrowLeft size={16} />
			<span class="text-sm">Back to Applications</span>
		</a>
	</div>

	<div
		class="max-w-4xl mx-auto bg-foreground rounded-xl shadow-lg border border-border overflow-hidden"
	>
		{#if data.application}
			<div class="bg-background/50 backdrop-blur-sm border-b border-border p-8">
				<div class="flex items-start justify-between">
					<div class="flex-1">
						<div class="flex items-center gap-3 mb-2">
							<h1 class="text-4xl font-bold text-heading">{data.application.role}</h1>
							<a
								href="/applications/update/{data.application.id}"
								class="text-body hover:text-primary transition-colors"
								aria-label="Edit Application"
							>
								<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
									/>
								</svg>
							</a>
						</div>
						<div class="flex items-center gap-2 text-xl text-body">
							<Building size={20} />
							<span>at {data.application.company}</span>
						</div>
					</div>
					<div class="text-right">
						<span
							class="inline-block px-4 py-2 rounded-full text-sm font-medium {data.application
								.status === 'APPLIED'
								? 'bg-blue-100 text-blue-800'
								: data.application.status === 'INTERVIEWING'
									? 'bg-yellow-100 text-yellow-800'
									: data.application.status === 'REJECTED'
										? 'bg-red-100 text-red-800'
										: data.application.status === 'OFFER'
											? 'bg-green-100 text-green-800'
											: data.application.status === 'GHOSTED'
												? 'bg-gray-100 text-gray-800'
												: 'bg-gray-100 text-gray-800'}"
						>
							{data.application.status}
						</span>
					</div>
				</div>
			</div>

			<div class="p-8">
				<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
					<div
						class="bg-background p-6 rounded-xl border border-border hover:shadow-md transition-shadow"
					>
						<div class="flex items-center gap-3 mb-3">
							<div class="p-2 bg-primary/10 rounded-lg">
								<CheckCircle size={20} class="text-primary" />
							</div>
							<h3 class="font-semibold text-body">Status</h3>
						</div>
						<p class="text-xl font-medium text-heading">{data.application.status}</p>
					</div>

					<div
						class="bg-background p-6 rounded-xl border border-border hover:shadow-md transition-shadow"
					>
						<div class="flex items-center gap-3 mb-3">
							<div class="p-2 bg-primary/10 rounded-lg">
								<Briefcase size={20} class="text-primary" />
							</div>
							<h3 class="font-semibold text-body">Job Type</h3>
						</div>
						<p class="text-xl font-medium text-heading">{data.application.type}</p>
					</div>

					<div
						class="bg-background p-6 rounded-xl border border-border hover:shadow-md transition-shadow"
					>
						<div class="flex items-center gap-3 mb-3">
							<div class="p-2 bg-primary/10 rounded-lg">
								<Monitor size={20} class="text-primary" />
							</div>
							<h3 class="font-semibold text-body">Work Model</h3>
						</div>
						<p class="text-xl font-medium text-heading">{data.application.model}</p>
					</div>

					<div
						class="bg-background p-6 rounded-xl border border-border hover:shadow-md transition-shadow"
					>
						<div class="flex items-center gap-3 mb-3">
							<div class="p-2 bg-primary/10 rounded-lg">
								<MapPin size={20} class="text-primary" />
							</div>
							<h3 class="font-semibold text-body">Location</h3>
						</div>
						<p class="text-xl font-medium text-heading">{data.application.location}</p>
					</div>

					<div
						class="bg-background p-6 rounded-xl border border-border hover:shadow-md transition-shadow md:col-span-2 lg:col-span-4"
					>
						<div class="flex items-center gap-3 mb-3">
							<div class="p-2 bg-primary/10 rounded-lg">
								<Calendar size={20} class="text-primary" />
							</div>
							<h3 class="font-semibold text-body">Applied On</h3>
						</div>
						<p class="text-xl font-medium text-heading">
							{data.application.appliedAt.toDateString()}
						</p>
					</div>

					<div
						class="bg-background p-6 rounded-xl border border-border hover:shadow-md transition-shadow md:col-span-2 lg:col-span-4"
					>
						<div class="flex items-center gap-3 mb-4">
							<div class="p-2 bg-primary/10 rounded-lg">
								<svg
									class="w-5 h-5 text-primary"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
									/>
								</svg>
							</div>
							<h3 class="font-semibold text-body">Notes</h3>
						</div>
						<div class="bg-foreground p-4 rounded-lg border border-border">
							{#if data.application.notes}
								<p class="text-heading leading-relaxed whitespace-pre-wrap">
									{data.application.notes}
								</p>
							{:else}
								<div class="flex items-center justify-center py-8">
									<div class="text-center">
										<div
											class="w-12 h-12 mx-auto mb-3 bg-border/20 rounded-full flex items-center justify-center"
										>
											<svg
												class="w-6 h-6 text-body/50"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
												/>
											</svg>
										</div>
										<p class="text-body/70 text-sm">No notes added yet</p>
									</div>
								</div>
							{/if}
						</div>
					</div>
				</div>
			</div>
		{:else}
			<div class="p-12 text-center">
				<div class="max-w-md mx-auto">
					<div
						class="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center"
					>
						<svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
							/>
						</svg>
					</div>
					<h1 class="text-2xl font-bold text-heading mb-2">Application not found</h1>
					<p class="text-body mb-6">
						The application you are looking for does not exist or may have been removed.
					</p>
					<a
						href="/applications"
						class="inline-flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-heading font-medium rounded-lg transition-colors"
					>
						<ArrowLeft size={16} />
						Back to Applications
					</a>
				</div>
			</div>
		{/if}
	</div>
</div>
