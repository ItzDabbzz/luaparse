return {
	['testburger'] = {
		label = 'Test Burger',
		weight = 2200,
		degrade = 60,
		client = {
			image = 'burger_chicken.png',
			status = {
				hunger = 200000,
			},
			anim = 'eating',
			prop = 'burger',
			usetime = 2500,
			export = 'ox_inventory_examples.testburger',
		},
		server = {
			export = 'ox_inventory_examples.testburger',
			test = 'what an amazingly delicious burger, amirite?',
		},
		buttons = {
			{
				label = 'Lick it',
				group = 'undefined',
				action = function(slot)
					print('Button clicked')
				end,
			},
			{
				label = 'Squeeze it',
				group = 'undefined',
				action = function(slot)
					print('Button clicked')
				end,
			},
			{
				label = 'What do you call a vegan burger?',
				group = 'Hamburger Puns',
				action = function(slot)
					print('Button clicked')
				end,
			},
			{
				label = 'What do frogs like to eat with their hamburgers?',
				group = 'Hamburger Puns',
				action = function(slot)
					print('Button clicked')
				end,
			},
			{
				label = 'Why were the burger and fries running?',
				group = 'Hamburger Puns',
				action = function(slot)
					print('Button clicked')
				end,
			},
		},
		consume = 0.3,
	},
	['bandage'] = {
		label = 'Bandage',
		weight = 115,
		client = {
			anim = {
				dict = 'missheistdockssetup1clipboard@idle_a',
				clip = 'idle_a',
				flag = 49,
			},
			prop = {
				model = `prop_rolled_sock_02`,
				pos = vec3(-0.14, -0.14, -0.08),
				rot = vec3(-50, -50, 0),
			},
			disable = {
				move = true,
				car = true,
				combat = true,
			},
			usetime = 2500,
			image = 'bandage.png',
		},
	},
	['black_money'] = {
		label = 'Dirty Money',
		client = {
			image = 'black_money.png',
		},
	},
	['burger'] = {
		label = 'Burger',
		weight = 220,
		client = {
			status = {
				hunger = 200000,
			},
			anim = 'eating',
			prop = 'burger',
			usetime = 2500,
			notification = 'You ate a delicious burger',
			image = 'burger.png',
		},
	},
	['sprunk'] = {
		label = 'Sprunk',
		weight = 350,
		client = {
			status = {
				thirst = 200000,
			},
			anim = {
				dict = 'mp_player_intdrink',
				clip = 'loop_bottle',
			},
			prop = {
				model = `prop_ld_can_01`,
				pos = vec3(0.01, 0.01, 0.06),
				rot = vec3(5, 5, -180.5),
			},
			usetime = 2500,
			notification = 'You quenched your thirst with a sprunk',
			image = 'sprunk.png',
		},
	},
	['parachute'] = {
		label = 'Parachute',
		weight = 8000,
		stack = false,
		client = {
			anim = {
				dict = 'clothingshirt',
				clip = 'try_shirt_positive_d',
			},
			usetime = 1500,
			image = 'parachute.png',
		},
	},
	['garbage'] = {
		label = 'Garbage',
		client = {
			image = 'garbage.png',
		},
	},
	['paperbag'] = {
		label = 'Paper Bag',
		weight = 1,
		stack = false,
		close = false,
		consume = 0,
		client = {
			image = 'paperbag.png',
		},
	},
	['identification'] = {
		label = 'Identification',
		client = {
			image = 'card_id.png',
		},
	},
	['panties'] = {
		label = 'Knickers',
		weight = 10,
		consume = 0,
		client = {
			status = {
				thirst = -100000,
				stress = -25000,
			},
			anim = {
				dict = 'mp_player_intdrink',
				clip = 'loop_bottle',
			},
			prop = {
				model = `prop_cs_panties_02`,
				pos = vec3(0.03, 0, 0.02),
				rot = vec3(0, -13.5, -1.5),
			},
			usetime = 2500,
			image = 'panties.png',
		},
	},
	['lockpick'] = {
		label = 'Lockpick',
		weight = 160,
		client = {
			image = 'lockpick.png',
		},
	},
	['phone'] = {
		label = 'Phone',
		weight = 190,
		stack = false,
		consume = 0,
		client = {
			add = null,
			remove = null,
			image = 'phone.png',
		},
	},
	['money'] = {
		label = 'Money',
		client = {
			image = 'money.png',
		},
	},
	['mustard'] = {
		label = 'Mustard',
		weight = 500,
		client = {
			status = {
				hunger = 25000,
				thirst = 25000,
			},
			anim = {
				dict = 'mp_player_intdrink',
				clip = 'loop_bottle',
			},
			prop = {
				model = `prop_food_mustard`,
				pos = vec3(0.01, 0, -0.07),
				rot = vec3(1, 1, -1.5),
			},
			usetime = 2500,
			notification = 'You.. drank mustard',
			image = 'mustard.png',
		},
	},
	['water'] = {
		label = 'Water',
		weight = 500,
		client = {
			status = {
				thirst = 200000,
			},
			anim = {
				dict = 'mp_player_intdrink',
				clip = 'loop_bottle',
			},
			prop = {
				model = `prop_ld_flow_bottle`,
				pos = vec3(0.03, 0.03, 0.02),
				rot = vec3(0, 0, -1.5),
			},
			usetime = 2500,
			cancel = true,
			notification = 'You drank some refreshing water',
			image = 'water.png',
		},
	},
	['radio'] = {
		label = 'Radio',
		weight = 1000,
		stack = false,
		allowArmed = true,
		client = {
			image = 'radio.png',
		},
	},
	['armour'] = {
		label = 'Bulletproof Vest',
		weight = 3000,
		stack = false,
		client = {
			anim = {
				dict = 'clothingshirt',
				clip = 'try_shirt_positive_d',
			},
			usetime = 3500,
			image = 'armour.png',
		},
	},
	['clothing'] = {
		label = 'Clothing',
		consume = 0,
		client = {
			image = 'clothing.png',
		},
	},
	['mastercard'] = {
		label = 'Fleeca Card',
		stack = false,
		weight = 10,
		client = {
			image = 'card_bank.png',
		},
	},
	['scrapmetal'] = {
		label = 'Scrap Metal',
		weight = 80,
		client = {
			image = 'scrapmetal.png',
		},
	},
	['green_phone'] = {
		label = 'Green Phone',
		weight = 150,
		stack = false,
		consume = 0,
		client = {
			export = "qs-smartphone-pro.UsePhoneItem",
			add = function(total)
				TriggerServerEvent('phone:itemAdd')
			end,
			remove = function(total)
				TriggerServerEvent('phone:itemDelete')
			end,
			image = 'green_phone.png',
		},
	},
}
