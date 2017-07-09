<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use JMS\Serializer\Annotation as Serializer;
use Hateoas\Configuration\Annotation as Hateoas;

/**
 * Categorypost
 *
 * @ORM\Table(name="categorypost", indexes={@ORM\Index(name="fk_CategotyPost_CategotyPost1_idx", columns={"id_categoryPost_parent"})})
 * @ORM\Entity
 *
 * @Serializer\ExclusionPolicy("all")
 * @Hateoas\Relation("self", href = "expr('/categoryposts/' ~ object.getId())")
 */
class Categorypost
{
    /**
     * @var integer
     *
     * @ORM\Column(name="id_categotyPost", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="IDENTITY")
     *
     * @Serializer\Expose()
     */
    private $id;

    /**
     * @var string
     *
     * @ORM\Column(name="title", type="string", length=150, nullable=true)
     *
     * @Serializer\Expose()
     */
    private $title;

    /**
     * @var string
     *
     * @ORM\Column(name="pathCoverImage", type="string", length=255, nullable=true)
     *
     * @Serializer\Expose()
     */
    private $pathcoverimage;

    /**
     * @var \AppBundle\Entity\Categorypost
     *
     * @ORM\ManyToOne(targetEntity="AppBundle\Entity\Categorypost")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="id_categoryPost_parent", referencedColumnName="id_categotyPost")
     * })
     *
     * @Serializer\Expose()
     */
    private $idCategorypostParent;

    /**
     * @var \Doctrine\Common\Collections\Collection
     *
     * @ORM\ManyToMany(targetEntity="AppBundle\Entity\Categorypost", inversedBy="idParent")
     * @ORM\JoinTable(name="categorypostenfant",
     *   joinColumns={
     *     @ORM\JoinColumn(name="id_parent", referencedColumnName="id_categotyPost")
     *   },
     *   inverseJoinColumns={
     *     @ORM\JoinColumn(name="id_enfant", referencedColumnName="id_categotyPost")
     *   }
     * )
     *
     * @Serializer\Expose()
     */
    private $idEnfant;

    /**
     * Constructor
     */
    public function __construct()
    {
        $this->idEnfant = new \Doctrine\Common\Collections\ArrayCollection();
    }


    /**
     * Get id
     *
     * @return integer 
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set title
     *
     * @param string $title
     * @return Categorypost
     */
    public function setTitle($title)
    {
        $this->title = $title;

        return $this;
    }

    /**
     * Get title
     *
     * @return string 
     */
    public function getTitle()
    {
        return $this->title;
    }

    /**
     * Set pathcoverimage
     *
     * @param string $pathcoverimage
     * @return Categorypost
     */
    public function setPathcoverimage($pathcoverimage)
    {
        $this->pathcoverimage = $pathcoverimage;

        return $this;
    }

    /**
     * Get pathcoverimage
     *
     * @return string 
     */
    public function getPathcoverimage()
    {
        return $this->pathcoverimage;
    }

    /**
     * Set idCategorypostParent
     *
     * @param \AppBundle\Entity\Categorypost $idCategorypostParent
     * @return Categorypost
     */
    public function setIdCategorypostParent(\AppBundle\Entity\Categorypost $idCategorypostParent = null)
    {
        $this->idCategorypostParent = $idCategorypostParent;

        return $this;
    }

    /**
     * Get idCategorypostParent
     *
     * @return \AppBundle\Entity\Categorypost 
     */
    public function getIdCategorypostParent()
    {
        return $this->idCategorypostParent;
    }

    /**
     * Add idEnfant
     *
     * @param \AppBundle\Entity\Categorypost $idEnfant
     * @return Categorypost
     */
    public function addIdEnfant(\AppBundle\Entity\Categorypost $idEnfant)
    {
        $this->idEnfant[] = $idEnfant;

        return $this;
    }

    /**
     * Remove idEnfant
     *
     * @param \AppBundle\Entity\Categorypost $idEnfant
     */
    public function removeIdEnfant(\AppBundle\Entity\Categorypost $idEnfant)
    {
        $this->idEnfant->removeElement($idEnfant);
    }

    /**
     * Get idEnfant
     *
     * @return \Doctrine\Common\Collections\Collection 
     */
    public function getIdEnfant()
    {
        return $this->idEnfant;
    }
}
