<script lang="ts">
	import '../app.css';
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';
	import { Home, Briefcase, LogOut, User } from '@lucide/svelte';

	let { children, data } = $props();
</script>

<div class="flex h-screen bg-[#cfdbd5] text-[#242423]">
	<!-- Sidebar -->
	<aside class="w-64 flex-shrink-0 bg-[#e8eddf] flex flex-col">
		<div class="h-16 flex items-center px-6 border-b border-[#333533]">
			<h1 class="text-2xl font-bold text-[#242423]">pursuit</h1>
		</div>
		<nav class="flex-1 px-6 py-6 space-y-2">
			<a href="/" class="flex items-center gap-3 px-4 py-2 rounded-lg text-lg hover:bg-[#cfdbd5] transition-colors">
				<Home class="w-5 h-5" />
				<span>Dashboard</span>
			</a>
			<a href="/applications" class="flex items-center gap-3 px-4 py-2 rounded-lg text-lg hover:bg-[#cfdbd5] transition-colors">
				<Briefcase class="w-5 h-5" />
				<span>Applications</span>
			</a>
			<a href="/jobs" class="flex items-center gap-3 px-4 py-2 rounded-lg text-lg hover:bg-[#cfdbd5] transition-colors">
				<Briefcase class="w-5 h-5" />
				<span>Jobs</span>
			</a>
		</nav>
		<div class="px-6 py-6 border-t border-[#333533]">
			{#if data.user}
				<div class="flex items-center gap-3 mb-4">
					<User class="w-8 h-8 p-1.5 bg-[#cfdbd5] rounded-full" />
					<span class="text-lg font-medium">{data.user.username}</span>
				</div>
				<form method="POST" action="?/logout" use:enhance>
					<button class="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-lg text-[#242423] hover:bg-[#cfdbd5] transition-colors">
						<LogOut class="w-5 h-5" />
						<span>Logout</span>	
					</button>
				</form>
			{:else}
				<a href="/login" class="flex items-center gap-3 px-4 py-2 rounded-lg text-lg hover:bg-[#cfdbd5] transition-colors">
					<User class="w-5 h-5" />
					<span>Login</span>
				</a>
			{/if}
		</div>
	</aside>

	<!-- Main Content -->
	<div class="flex-1 flex flex-col overflow-hidden">
		<main class="flex-1 overflow-y-auto p-8">
			{@render children()}
		</main>
	</div>
</div>
