package dao;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.util.Collection;
import java.util.HashMap;
import java.util.Map;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.core.util.DefaultPrettyPrinter;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectWriter;

import beans.Amenity;


public class AmenityDAO {

	private Map<Integer, Amenity> amenities = new HashMap<>();
	
	public AmenityDAO() {
		
	}
	
	public AmenityDAO(String contextPath) {
		loadAmenities(contextPath);
	}
	
	public void loadAmenities(String path) {
		BufferedReader in = null;
		try {
			File file = new File(path + "/data/amenities.json");
			in = new BufferedReader(new FileReader(file));
			String line;
			StringBuilder sb = new StringBuilder();
			while ((line = in.readLine()) != null) {
				sb.append(line);
			}
			ObjectMapper mapper = new ObjectMapper();
			this.amenities = mapper.readValue(sb.toString(), new TypeReference<Map<Integer, Amenity>>(){});
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
	
	public void saveAmenities(String path) {
		BufferedWriter out = null;
		try {
			File file = new File(path + "/data/amenities.json");
			out = new BufferedWriter(new FileWriter(file));
			ObjectMapper mapper = new ObjectMapper();
			ObjectWriter writer = mapper.writer(new DefaultPrettyPrinter());
			String content = writer.writeValueAsString(this.amenities);
			out.write(content);
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			if (out != null) {
				try {
					out.close();
				} catch (Exception e) {
					
				}
			}
		}
	}
	
	public Amenity findAmenity(Integer id) {
		return this.amenities.get(id);
	}
	
	public Collection<Amenity> findAllAmenities() {
		return this.amenities.values();
	}
	
	public Amenity addAmenity(Amenity amenity) {
		return this.amenities.put(amenity.getId(), amenity);
	}
	
	public Amenity updateAmenity(Amenity amenity) {
		return this.amenities.replace(amenity.getId(), amenity);
	}
	
	// ne koristimo; za fizicko brisanje
	public Amenity removeAmenity(Integer id) {
		return this.amenities.remove(id);
	}
}
