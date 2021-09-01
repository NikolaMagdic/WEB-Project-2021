package dao;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.core.util.DefaultPrettyPrinter;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectWriter;

import beans.Order;

public class OrderDAO {

	private Map<String, Order> ordersMap = new HashMap<>();
	
	public OrderDAO() {
		
	}
	
	public OrderDAO(String contextPath) {
		loadOrders(contextPath);
	}
	
	public void loadOrders(String path) {
		BufferedReader in = null;
		try {
			
			File file = new File(path + "data/orders.json");
			
			in = new BufferedReader(new FileReader(file));
			
			String line;
			StringBuilder sb = new StringBuilder();
			while ((line = in.readLine()) != null) {
				sb.append(line);
			}
			
			// Iz Jackson biblioteke, omogucava nam da cuvamo i ucitavamo json fajlove
			ObjectMapper mapper = new ObjectMapper();
			this.ordersMap = mapper.readValue(sb.toString(), new TypeReference<Map<String, Order>>(){});
			
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			if (in != null) {
				try {
					in.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		}
	}
	
	public void saveOrders(String path) {
		BufferedWriter out = null;
		
		try {
			File file = new File(path + "data/orders.json");
			out = new BufferedWriter(new FileWriter(file));
			
			ObjectMapper mapper = new ObjectMapper();
			ObjectWriter writer = mapper.writer(new DefaultPrettyPrinter());
			
			String content = writer.writeValueAsString(this.ordersMap);
			out.write(content);
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			if (out != null) {
				try {
					out.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		}
	}
	
	public void addOrder(Order order) {
		this.ordersMap.put(order.getOrderId(), order);
	}
	
	public Order updateOrder(Order order) {
		return ordersMap.put(order.getOrderId(), order);
	}
}
