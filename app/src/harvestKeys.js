import parseISO from 'date-fns/parseISO';
import format from 'date-fns/format';

/**
 * All the keys the Harvest API returns
 *
 * @type {Object}
 */
export const harvestKeys = {
	date: {
		name: 'Date',
		value: (item) => (item.spent_date ? format(parseISO(item.spent_date), 'dd MMM yy') : ''),
	},
	hours: {
		name: 'Hours',
		value: (item) => item.hours,
	},
	rounded_hours: {
		name: 'Rounded Hours',
		value: (item) => item.rounded_hours,
	},
	notes: {
		name: 'Notes',
		value: (item) => item.notes,
	},
	locked: {
		name: 'Locked',
		value: (item) => (item.is_locked ? 'Yes' : 'No'),
	},
	locked_reason: {
		name: 'Locked Reason',
		value: (item) => item.locked_reason,
	},
	closed: {
		name: 'Closed',
		value: (item) => (item.is_closed ? 'Yes' : 'No'),
	},
	billed: {
		name: 'Billed',
		value: (item) => (item.is_billed ? 'Yes' : 'No'),
	},
	timer_started_at: {
		name: 'Timer Started At',
		value: (item) => item.timer_started_at,
	},
	started_time: {
		name: 'Started Timer',
		value: (item) => item.started_time,
	},
	ended_time: {
		name: 'Ended Timer',
		value: (item) => item.ended_time,
	},
	running: {
		name: 'Running',
		value: (item) => (item.is_running ? 'Yes' : 'No'),
	},
	billable: {
		name: 'Billable',
		value: (item) => item.billable,
	},
	budgeted: {
		name: 'Budgeted',
		value: (item) => item.budgeted,
	},
	billable_rate: {
		name: 'Billable Rate',
		value: (item) => item.billable_rate,
	},
	billable_amount: {
		name: 'Billable Amount',
		value: (item) => item.rounded_hours * item.billable_rate,
	},
	cost_rate: {
		name: 'Cost Rate',
		value: (item) => item.cost_rate,
	},
	cost_amount: {
		name: 'Cost Amount',
		value: (item) => item.rounded_hours * item.cost_rate,
	},
	created_at: {
		name: 'Created At',
		value: (item) =>
			item.created_at ? format(parseISO(item.created_at), 'dd MMM yy h:m:s a') : '',
	},
	updated_at: {
		name: 'Updated At',
		value: (item) =>
			item.updated_at ? format(parseISO(item.updated_at), 'dd MMM yy h:m:s a') : '',
	},
	user: {
		name: 'User',
		value: (item) => item.user.name,
	},
	client: {
		name: 'Client',
		value: (item) => item.client.name,
	},
	currency: {
		name: 'Currency',
		value: (item) => item.client.currency,
	},
	project: {
		name: 'Project',
		value: (item) => item.project.name,
	},
	project_code: {
		name: 'Project Code',
		value: (item) => item.project.code,
	},
	task: {
		name: 'Task',
		value: (item) => item.task.name,
	},
};
