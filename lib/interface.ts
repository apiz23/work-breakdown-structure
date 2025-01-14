export interface Task {
	id: string;
	name: string;
	desc: string;
	project_id: string;
	duration: number;
	mandays: number;
	priority: string;
}

export interface Project {
	id: string;
	name: string;
	desc: string;
	start_date: string;
	end_date: string;
	status: string;
	completion: number;
	total_mandays: number;
	created_at: string;
}

export interface User {
	id: string;
	name: string;
	username: string;
	email: string;
	role: string;
	created_at: string;
	tasks_assign: string[];
	project_assign: string[];
}

export interface Log {
	id: number; 
	user_id?: string | null;
	action?: string | null; 
	details?: string | null; 
	status?: string | null;
	item_id?: string | null; 
	item_type?: string | null; 
	created_at: string;
}
