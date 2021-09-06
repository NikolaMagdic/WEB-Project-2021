package dao;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.util.Collection;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.core.util.DefaultPrettyPrinter;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectWriter;

import beans.Restaurant;

public class RestaurantDAO {

	private Map<Integer, Restaurant> restaurantsMap = new HashMap<>();

	public RestaurantDAO() {
		
	}
	
	public RestaurantDAO(String contextPath) {
		loadRestaurants(contextPath);
	}

	public void loadRestaurants(String path) {
		BufferedReader in = null;
		try {

			File file = new File(path + "data/restaurants.json");

			in = new BufferedReader(new FileReader(file));
			String line;
			StringBuilder sb = new StringBuilder();
			while ((line = in.readLine()) != null) {
				sb.append(line);
			}
			ObjectMapper mapper = new ObjectMapper();
			this.restaurantsMap = mapper.readValue(sb.toString(), new TypeReference<Map<Integer, Restaurant>>(){});
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			if (in != null) {
				try {
					in.close();
				} catch (Exception e) {}
			}
		}
	}
	
	public void saveRestaurants(String path) {
		BufferedWriter out = null;
		try {
			File file = new File(path + "/data/restaurants.json");
			out = new BufferedWriter(new FileWriter(file));
			ObjectMapper mapper = new ObjectMapper();
			ObjectWriter writer = mapper.writer(new DefaultPrettyPrinter());  
			String content = writer.writeValueAsString(this.restaurantsMap);
			out.write(content);
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			if (out != null) {
				try {
					out.close();
				} catch (Exception e) {}
			}
		}
	}

	public Restaurant addRestaurant(Restaurant restaurant) {
		
		this.restaurantsMap.put(restaurant.getId(), restaurant);
		
		return restaurant;
	}
	
	public Collection<Restaurant> findAllRestaurants() {
		return this.restaurantsMap.values();
	}

	
	public Restaurant findRestaurant(Integer id) {
		return restaurantsMap.containsKey(id) ? restaurantsMap.get(id) : null;
	}
	
	public Restaurant updateApartment(Restaurant restaurant) {
		return restaurantsMap.put(restaurant.getId(), restaurant);
	}
	
	public Restaurant removeRestaurant(Restaurant restaurant) {
		return restaurantsMap.remove(restaurant.getId());
	}
	
//	public Restaurant findRestaurantByManager(String managerUsername) {
//		for (Map.Entry<Integer, Restaurant> entry : restaurantsMap.entrySet()) {
//		    Integer key = entry.getKey();
//		    Restaurant value = entry.getValue();
//		    if(value.get)
//		}
//	}
	
}
