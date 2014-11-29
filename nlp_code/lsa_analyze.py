import numpy as np
import numpy.linalg as la
import matplotlib.pyplot as pt

def getWordDocMatrix(documents):
    docWordMap = {}
    for docidx in range(len(documents)):
        doc = documents[docidx]
        for word in doc:
            if word in docWordMap:
                if docidx in docWordMap[word]:
                    docWordMap[word][docidx] = docWordMap[word][docidx] + 1
                else:
                    docWordMap[word][docidx] = 1
            else:
                docWordMap[word] = {docidx:1}
    
    matrix = np.array(len(docWordMap)*[len(documents)*[0.0]], dtype=np.float)
    words = list(docWordMap.keys())
    for wordidx in range(len(docWordMap)):
        wordMap = docWordMap[words[wordidx]]
        for docidx in wordMap.keys():
            matrix[wordidx,docidx] = wordMap[docidx]
    
    return (matrix, words)

A, words = getWordDocMatrix(documents)
U, Sigma, VT = la.svd(A, full_matrices=False)
# truncate SVD to rank r by doing following
U_hat = U[:,:r]
Sigma_hat = Sigma[:r]
VT_hat = VT[:r,:]
A_hat = U_hat.dot(np.diag(Sigma_hat)).dot(VT_hat)

A_lsa = np.zeros((r, len(documents)))
for j in range(len(documents)):
    A_lsa[:,j] = np.diag(Sigma_hat).dot(U_hat.T).dot(A_hat[:,j])

d = np.zeros((A_hat.shape[0])) # A_hat.shape[0] == num_words_total
for wordidx in range(len(words)):
    if words[wordidx] in query:
        d[wordidx] = d[wordidx] + 1
q_lsa = np.diag(Sigma_hat).dot(U_hat.T).dot(d)

# Plotting code
pt.figure()
pt.plot(A_lsa[:,0],A_lsa[:,0], ".")
pt.plot(q_lsa[0]*3000, q_lsa[1]*3000, "x")

# Construct cosine_similarities
cosine_similarities = np.zeros((len(documents)))
for i in range(cosine_similarities.shape[0]):
    cos_sim = (A_lsa[:,i].dot(q_lsa)) / (la.norm(q_lsa, 2.0) * la.norm(A_lsa[:,i], 2.0))
    cosine_similarities[i] = cos_sim

# print tuples
cos_sims_list = list(cosine_similarities)
ranking = list(zip(cos_sims_list, titles))
def getKey(item):
    return item[0]
ranking = sorted(ranking, key=getKey, reverse=True)
print(str(query))
print(str(ranking))