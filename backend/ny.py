import numpy as np

# Бастапқы 6x6 сурет
image = np.array([
    [1, 2, 0, 3, 1, 2],
    [2, 1, 1, 0, 2, 3],
    [0, 1, 2, 3, 1, 0],
    [3, 0, 1, 2, 2, 1],
    [2, 1, 0, 1, 3, 0],
    [1, 0, 2, 1, 0, 2]
])

# Екі фильтр (ядро)
kernel1 = np.array([
    [1, 0, -1],
    [1, 0, -1],
    [1, 0, -1]
])

kernel2 = np.array([
    [-1, 2, -1],
    [0, 0, 0],
    [-1, 2, -1]
])


# Конволюция функциясы
def convolve(image, kernel):
    h, w = image.shape
    kh, kw = kernel.shape
    output_size = h - kh + 1  # 6x6 -> 4x4 шығыс өлшемі
    output = np.zeros((output_size, output_size))

    for i in range(output_size):
        for j in range(output_size):
            region = image[i:i + kh, j:j + kw]
            output[i, j] = np.sum(region * kernel)
    
    return output


# ReLU функциясы (барлық теріс мәндерді 0-ге айналдырады)
def relu(feature_map):
    return np.maximum(feature_map, 0)


# Max Pooling (2x2 терезе)
def max_pooling(feature_map):
    h, w = feature_map.shape
    pooled_size = h // 2  # 4x4 -> 2x2
    pooled = np.zeros((pooled_size, pooled_size))

    for i in range(pooled_size):
        for j in range(pooled_size):
            pooled[i, j] = np.max(feature_map[i * 2:i * 2 + 2, j * 2:j * 2 + 2])
    
    return pooled


# 1-ші және 2-ші фильтрді қолдану
feature_map1 = convolve(image, kernel1)
feature_map2 = convolve(image, kernel2)

# ReLU активациясын қолдану
relu1 = relu(feature_map1)
relu2 = relu(feature_map2)

# Max Pooling қолдану
pooled1 = max_pooling(relu1)
pooled2 = max_pooling(relu2)

# Нәтижелерді шығару
print("Feature Map 1 after Convolution:\n", feature_map1)
print("\nFeature Map 2 after Convolution:\n", feature_map2)

print("\nFeature Map 1 after ReLU:\n", relu1)
print("\nFeature Map 2 after ReLU:\n", relu2)

print("\nFeature Map 1 after Max Pooling:\n", pooled1)
print("\nFeature Map 2 after Max Pooling:\n", pooled2)
