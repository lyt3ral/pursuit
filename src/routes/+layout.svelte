<script lang="ts">
	import '../app.css';
	import { enhance } from '$app/forms';
	import { Home, BriefcaseBusiness, LogOut, User, FileText } from '@lucide/svelte';
	import { page } from '$app/stores';

	let { children, data } = $props();

	let showSidebar = $derived($page.url.pathname !== '/login' && $page.url.pathname !== '/register');
</script>

<div class="flex h-screen bg-background text-heading">
	{#if showSidebar}
		<!-- Sidebar -->
		<aside class="w-48 flex-shrink-0 bg-foreground flex flex-col border-r border-border">
			<div class="h-16 flex items-center px-6">
				<h1 class="text-2xl font-bold text-heading">pursuit</h1>
			</div>
			<nav class="flex-1 px-2 py-6 space-y-2">
				<a
					href="/"
					class="flex items-center gap-3 py-2 px-4 rounded-lg text-lg hover:bg-background transition-colors"
				>
					<Home class="w-5 h-5" />
					<span>Dashboard</span>
				</a>
				<a
					href="/applications"
					class="flex items-center gap-3 py-2 px-4 rounded-lg text-lg hover:bg-background transition-colors"
				>
					<FileText class="w-5 h-5" />
					<span>Applications</span>
				</a>
				<a
					href="/jobs"
					class="flex items-center gap-3 py-2 px-4 rounded-lg text-lg hover:bg-background transition-colors"
				>
					<BriefcaseBusiness class="w-5 h-5" />
					<span>Jobs</span>
				</a>
			</nav>
			<div class="px-2 py-6">
				{#if data.user}
					<div class="flex items-center gap-2 mb-4 px-2">
						<User class="w-8 h-8 p-1.5 bg-background rounded-full" />
						<span class="text-lg font-medium">{data.user.username}</span>
					</div>
					<form method="POST" action="?/logout" use:enhance>
						<button
							class="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-lg text-heading hover:bg-destructive transition-colors"
						>
							<LogOut class="w-5 h-5" />
							<span>Logout</span>
						</button>
					</form>
				{:else}
					<a
						href="/login"
						class="flex items-center gap-3 px-4 py-2 rounded-lg text-lg hover:bg-background transition-colors"
					>
						<User class="w-5 h-5" />
						<span>Login</span>
					</a>
				{/if}
			</div>
		</aside>
	{/if}

	<!-- Main Content -->
	<div class="flex-1 flex flex-col overflow-hidden">
		<main class="flex-1 overflow-y-auto p-8">
			{@render children()}
		</main>
	</div>
</div>
